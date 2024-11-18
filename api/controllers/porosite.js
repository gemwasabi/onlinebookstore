import stripe from "../config/stripe.js";
import { db } from "../db.js";

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
  const { userId, totalAmount, cartItems, shippingInfo, paymentIntentId } = req.body;

  console.log("Received order data:", req.body);

  if (!userId || !cartItems || cartItems.length === 0 || !shippingInfo) {
    console.error("Invalid order data:", { userId, totalAmount, cartItems, shippingInfo });
    return res.status(400).json({ error: "Invalid order data." });
  }

  try {
    await query("START TRANSACTION");

    let addressId = shippingInfo.id;
    if (!addressId) {
      const addressQuery = `
        INSERT INTO adresat (perdoruesi_id, adresa, qyteti, kodi_postar, telefoni, shteti)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const addressValues = [
        userId,
        shippingInfo.address || "",
        shippingInfo.city || "",
        shippingInfo.postalCode || "",
        shippingInfo.phone || "",
        shippingInfo.shteti || "",
      ];

      const addressResult = await query(addressQuery, addressValues);

      if (!addressResult.insertId) {
        throw new Error("Failed to insert address.");
      }
      addressId = addressResult.insertId;
    }

    console.log("Address ID:", addressId);

    const orderQuery = `
      INSERT INTO porosite (perdoruesi_id, data, totali, statusi, adresa_1, adresa_2, qyteti, kodi_postar, komenti_shtese)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      userId,
      totalAmount,
      0,
      shippingInfo.address,
      shippingInfo.address2 || "",
      shippingInfo.city,
      shippingInfo.postalCode,
      shippingInfo.comment || "",
    ];

    const orderResult = await query(orderQuery, orderValues);

    if (!orderResult.insertId) {
      throw new Error("Failed to insert order.");
    }
    const orderId = orderResult.insertId;

    console.log("Order ID:", orderId);

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

    console.log("Order items inserted successfully.");

    await query("COMMIT");

    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Error saving order:", error);
    res.status(500).json({ error: error.message });
  }
};
