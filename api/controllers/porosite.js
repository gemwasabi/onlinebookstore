import stripe from "../config/stripe.js";
import { db } from "../db.js";
import nodemailer from "nodemailer";

export const krijoPagesen = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import { promisify } from "util";

const query = promisify(db.query).bind(db);

export const saveOrder = async (req, res) => {
  const { userId, totalAmount, cartItems, shippingInfo, paymentIntentId, transportMethod } = req.body;

  if (!userId || !cartItems || cartItems.length === 0) {
    console.error("Invalid order data:", { userId, totalAmount, cartItems, shippingInfo });
    return res.status(400).json({ error: "Invalid order data." });
  }

  if (!shippingInfo || !shippingInfo.email) {
    console.error("Missing shippingInfo or email:", shippingInfo);
    return res.status(400).json({ error: "Shipping info or email is missing." });
  }

  const email = shippingInfo.email;
  console.log("Recipient Email:", email);

  const sendOrderEmail = async (email, orderDetails) => {
    if (!email) {
      throw new Error("No recipient email provided.");
    }

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const itemsList = orderDetails.cartItems
    .map((item) => `<li>${item.quantity}x ${item.titulli || "Book"} - $${item.cmimi}</li>`)
    .join("");

  const emailBody = `
    <h2>Konfirmimi i porosise</h2>
    <p>Faleminderit per porosine tuaj!</p>
    <ul>${itemsList}</ul>
    <p><strong>Shuma totale:</strong> $${orderDetails.totalAmount.toFixed(2)}</p>
    <p>Adresa e dergimit: ${orderDetails.shippingInfo.adresa}, ${orderDetails.shippingInfo.qyteti}, ${orderDetails.shippingInfo.shteti}</p>
  `;

  const mailOptions = {
    from: '"Lype" <no-reply@teststore.com>',
    to: email, 
    subject: "Konfirmimi i porosise suaj- Lype",
    html: emailBody,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Emaili u dergu. Preview URL:", nodemailer.getTestMessageUrl(info)); 
};


  try {
    console.log("Payment Intent ID:", paymentIntentId);
    console.log("Shipping Info:", shippingInfo);

    let address = "";
    let city = "";
    let postalCode = "";
    let phone = "";
    let state = "";

    if (transportMethod === 0) { // 0: Pickup
      address = "E merr ne dyqan";
      city = "Prishtine";
      postalCode = "00000";
      phone = "00000000";
      state = "Kosova";
    } else {
      address = shippingInfo.adresa || "Unknown Address";
      city = shippingInfo.qyteti || "Unknown City";
      postalCode = shippingInfo.kodi_postar || "00000";
      phone = shippingInfo.telefoni || "00000000";
      state = shippingInfo.shteti || "Unknown Country";
    }

    await query("START TRANSACTION");

    let addressId = shippingInfo.id;

    if (!addressId && transportMethod === 1) {
      console.log("No Address ID. Attempting to Insert New Address...");
      const addressQuery = `
        INSERT INTO adresat (perdoruesi_id, adresa, qyteti, kodi_postar, telefoni, shteti)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const addressValues = [userId, address, city, postalCode, phone, state];

      const addressResult = await query(addressQuery, addressValues);

      if (!addressResult.insertId) {
        throw new Error("Failed to insert address.");
      }

      addressId = addressResult.insertId;
      console.log("New Address ID:", addressId);
    }

    const paymentStatus = paymentIntentId && paymentIntentId.length > 0 ? 1 : 0; // 1: Completed, 0: Pending
    const paymentMethod = paymentIntentId && paymentIntentId.length > 0 ? 1 : 0; // 1: Stripe, 0: Cash

    const orderQuery = `
      INSERT INTO porosite (perdoruesi_id, data, totali, adresa_1, qyteti, kodi_postar, komenti_shtese, payment_method, payment_status, transport_method)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      userId,
      totalAmount,
      address,
      city,
      postalCode,
      shippingInfo.comment || "",
      paymentMethod,
      paymentStatus,
      transportMethod,
    ];

    const orderResult = await query(orderQuery, orderValues);

    if (!orderResult.insertId) {
      throw new Error("Failed to insert order.");
    }

    const orderId = orderResult.insertId;

    const orderItemsQuery = `
      INSERT INTO order_items (order_id, book_id, quantity, price)
      VALUES ?
    `;
    const orderItemsValues = cartItems.map((item) => [
      orderId,
      item.id,
      item.quantity,
      item.cmimi,
    ]);

    if (orderItemsValues.length > 0) {
      await query(orderItemsQuery, [orderItemsValues]);
    }

    const orderDetails = {
      cartItems,
      totalAmount,
      shippingInfo: {
        adresa: address,
        qyteti: city,
        shteti: state,
      },
      paymentIntentId,
    };

    await query("COMMIT");

    await sendOrderEmail(shippingInfo.email, orderDetails);

    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Error saving order:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updatePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  const validStatuses = [0, 1, 2, 3]; // 0: Pending, 1: Completed, 2: Failed, 3: Refunded
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ error: "Invalid payment status." });
  }

  const q = `
    UPDATE porosite 
    SET payment_status = ? 
    WHERE id = ?
  `;

  try {
    await query(q, [paymentStatus, orderId]);
    res.status(200).json({ message: "Payment status updated successfully." });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Error updating payment status." });
  }
};

