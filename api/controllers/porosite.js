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

  if (!userId || !cartItems || cartItems.length === 0 || !shippingInfo) {
    console.error("Invalid order data:", { userId, totalAmount, cartItems, shippingInfo });
    return res.status(400).json({ error: "Invalid order data." });
  }

  try {
    await query("START TRANSACTION");

    let addressId = shippingInfo.id;

    if (!addressId) {
      // Only create a new address if it's not an existing one
      const addressQuery = `
        INSERT INTO adresat (perdoruesi_id, adresa, qyteti, kodi_postar, telefoni, shteti)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const addressValues = [
        userId,
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.postalCode,
        shippingInfo.phone,
        shippingInfo.shteti,
      ];
    
      const addressResult = await query(addressQuery, addressValues);
    
      if (!addressResult.insertId) {
        throw new Error("Failed to insert address.");
      }
    
      addressId = addressResult.insertId;
    }
    const paymentStatus = paymentIntentId ? 1 : 0; // 1: Completed, 0: Pending
    const paymentMethod = paymentIntentId ? 1 : 0; // 1: Stripe, 0: Cash
    
    const orderQuery = `
      INSERT INTO porosite (perdoruesi_id, data, totali, statusi, adresa_1, adresa_2, qyteti, kodi_postar, komenti_shtese, payment_method, payment_status)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      userId,
      totalAmount,
      paymentStatus,
      shippingInfo.address,
      shippingInfo.address2 || "",
      shippingInfo.city,
      shippingInfo.postalCode,
      shippingInfo.comment || "",
      paymentMethod,
      paymentStatus,
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

    await query("COMMIT");

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

