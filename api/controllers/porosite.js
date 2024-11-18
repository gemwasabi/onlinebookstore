import stripe from "../config/stripe.js";

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
import { db } from "../db.js";

export const saveOrder = async (req, res) => {
  const { userId, totalAmount, cartItems, shippingInfo } = req.body;

  if (!userId || !cartItems || cartItems.length === 0 || !shippingInfo) {
    return res.status(400).json({ error: "Invalid order data." });
  }

  // Validate shipping info fields
  const { address, city, postalCode } = shippingInfo;
  if (!address || !city || !postalCode) {
    return res.status(400).json({ error: "Shipping information is incomplete." });
  }

  try {
    await db.beginTransaction();

    const orderQuery = `
      INSERT INTO porosite (perdoruesi_id, data, totali, statusi, adresa_1, adresa_2, qyteti, kodi_postar, komenti_shtese)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      userId,
      totalAmount,
      0, // statusi (default pending)
      address,
      shippingInfo.address2 || "",
      city,
      postalCode,
      shippingInfo.comment || "",
    ];

    const [orderResult] = await db.query(orderQuery, orderValues);
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
    await db.query(orderItemsQuery, [orderItemsValues]);

    await db.commit();

    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (err) {
    await db.rollback();
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Error saving order." });
  }
};
