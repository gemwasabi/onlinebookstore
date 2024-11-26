import stripe from "../config/stripe.js";
import { db } from "../db.js";
import nodemailer from "nodemailer";
import fs from "fs";
import PDFDocument from "pdfkit";
import { promisify } from "util";

const query = promisify(db.query).bind(db);

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
const generateInvoice = (orderDetails) => {
  const doc = new PDFDocument();
  const filePath = `invoices/invoice_${orderDetails.orderId}.pdf`;

  if (!fs.existsSync("invoices")) {
    fs.mkdirSync("invoices");
  }

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .image("lype-logo.png", 50, 45, { width: 100 })
    .fontSize(20)
    .text("Lype", 200, 50, { align: "right" })
    .fontSize(10)
    .text("Ubt Lab 1", 200, 80, { align: "right" })
    .text("+38344123123", 200, 95, { align: "right" })
    .text("lype@gmail.com", 200, 110, { align: "right" });

  doc.moveDown(3);

  doc
    .fontSize(18)
    .text("Fletpagesa", { align: "center" })
    .moveDown()
    .fontSize(12)
    .text(`Porosia ID: ${orderDetails.orderId}`, { align: "left" })
    .text(`Data: ${new Date().toLocaleDateString()}`, { align: "left" })
    .moveDown();

  doc
    .fontSize(12)
    .text("Adresa e faturimit:", { underline: true })
    .moveDown(0.5)
    .text(`${orderDetails.shippingInfo.name}`)
    .text(
      `${orderDetails.shippingInfo.adresa}, ${orderDetails.shippingInfo.qyteti}`
    )
    .text(
      `${orderDetails.shippingInfo.shteti}, ${orderDetails.shippingInfo.kodi_postar}`
    )
    .text(`Telefoni: ${orderDetails.shippingInfo.telefoni}`)
    .moveDown(2);

  doc.fontSize(14).text("Produktet:", { underline: true }).moveDown(0.5);

  doc
    .fontSize(12)
    .text("Produkti", 50, doc.y, { width: 200 })
    .text("Sasia", 250, doc.y, { width: 100 })
    .text("Cmimi", 350, doc.y, { width: 100, align: "right" })
    .text("Totali", 450, doc.y, { width: 100, align: "right" });

  orderDetails.cartItems.forEach((item) => {
    doc
      .moveDown(0.5)
      .fontSize(12)
      .text(item.titulli || "Libri", 50, doc.y, { width: 200 })
      .text(item.quantity, 250, doc.y, { width: 100 })
      .text(`$${item.cmimi.toFixed(2)}`, 350, doc.y, {
        width: 100,
        align: "right",
      })
      .text(`$${(item.quantity * item.cmimi).toFixed(2)}`, 450, doc.y, {
        width: 100,
        align: "right",
      });
  });

  doc
    .moveDown(2)
    .fontSize(14)
    .text(`Shuma totale: $${orderDetails.totalAmount.toFixed(2)}`, {
      align: "right",
    });

  doc.end();

  return filePath;
};

export const saveOrder = async (req, res) => {
  const {
    userId,
    totalAmount,
    cartItems,
    shippingInfo,
    paymentIntentId,
    transportMethod,
  } = req.body;

  if (!userId || !cartItems || cartItems.length === 0) {
    console.error("Invalid order data:", {
      userId,
      totalAmount,
      cartItems,
      shippingInfo,
    });
    return res.status(400).json({ error: "Invalid order data." });
  }

  if (!shippingInfo || !shippingInfo.email) {
    console.error("Missing shippingInfo or email:", shippingInfo);
    return res
      .status(400)
      .json({ error: "Shipping info or email is missing." });
  }

  const sendOrderEmail = async (email, orderDetails, invoicePath) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const itemsList = orderDetails.cartItems
      .map(
        (item) =>
          `<li>${item.quantity}x ${item.titulli || "Book"} - $${
            item.cmimi
          }</li>`
      )
      .join("");

    const emailBody = `
      <h2>Konfirmimi i porosise</h2>
      <p>Faleminderit per porosine tuaj!</p>
      <ul>${itemsList}</ul>
      <p><strong>Shuma totale:</strong> $${orderDetails.totalAmount.toFixed(
        2
      )}</p>
      <p>Adresa e dergimit: ${orderDetails.shippingInfo.adresa}, ${
      orderDetails.shippingInfo.qyteti
    }, ${orderDetails.shippingInfo.shteti}</p>
    `;

    const mailOptions = {
      from: '"Lype" <no-reply@teststore.com>',
      to: email,
      subject: "Konfirmimi i porosise suaj- Lype",
      html: emailBody,
      attachments: [
        {
          filename: `invoice_${orderDetails.orderId}.pdf`,
          path: invoicePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent. Preview URL:", nodemailer.getTestMessageUrl(info));
  };

  try {
    let address, city, postalCode, phone, state;

    if (transportMethod === 0) {
      // Pickup
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
      const addressQuery = `
        INSERT INTO adresat (perdoruesi_id, adresa, qyteti, kodi_postar, telefoni, shteti)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const addressValues = [userId, address, city, postalCode, phone, state];
      const addressResult = await query(addressQuery, addressValues);
      if (!addressResult.insertId) throw new Error("Failed to insert address.");
      addressId = addressResult.insertId;
    }

    const paymentStatus = paymentIntentId ? 1 : 0;
    const paymentMethod = paymentIntentId ? 1 : 0;

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
    if (!orderResult.insertId) throw new Error("Failed to insert order.");

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
    if (orderItemsValues.length > 0)
      await query(orderItemsQuery, [orderItemsValues]);

    const orderDetails = {
      orderId,
      cartItems,
      totalAmount,
      shippingInfo: {
        ...shippingInfo,
        adresa: address,
        qyteti: city,
        shteti: state,
      },
      paymentIntentId,
    };

    const invoicePath = generateInvoice(orderDetails);

    await query("COMMIT");

    await sendOrderEmail(shippingInfo.email, orderDetails, invoicePath);

    res
      .status(201)
      .json({ message: "Order saved successfully", orderId, invoicePath });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Error saving order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.body;
  const validStatuses = [0, 1, 2, 3];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ error: "Invalid payment status." });
  }
  const q = `UPDATE porosite SET payment_status = ? WHERE id = ?`;
  try {
    await query(q, [paymentStatus, orderId]);
    res.status(200).json({ message: "Payment status updated successfully." });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Error updating payment status." });
  }
};

export const getInvoice = async (req, res) => {
  const { orderId } = req.params;
  try {
    const filePath = `invoices/invoice_${orderId}.pdf`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Invoice not found." });
    }
    res.download(filePath, `invoice_${orderId}.pdf`);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Error fetching invoice." });
  }
};

export const merrPorosite = (req, res) => {
  const query = `
    SELECT *, date_format(data, "%d.%m.%Y %H:%i:%s") as data, concat(p.emri, " ", p.mbiemri) as perdoruesi
    FROM porosite
    left join perdoruesit p on p.id = perdoruesi_id
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Gabim në kërkimin e porosive." });
    }
    return res.status(200).json(data);
  });
};

export const merrPorositePerdoruesit = (req, res) => {
  const q = `
  SELECT 
    p.id AS porosiId,
    p.perdoruesi_id,
    p.data,
    p.totali,
    p.adresa_1,
    p.qyteti,
    p.kodi_postar,
    p.komenti_shtese,
    p.payment_method,
    p.payment_status, -- Include payment_status
    p.transport_method,
    (
      SELECT GROUP_CONCAT(
        CONCAT(
          '{"bookId":', oi.book_id, 
          ',"titulliLibrit":"', b.titulli, 
          '","sasia":', oi.quantity, 
          ',"cmimi":', oi.price, 
          '}'
        )
      )
      FROM order_items oi
      LEFT JOIN librat b ON oi.book_id = b.id
      WHERE oi.order_id = p.id
    ) AS artikujt
  FROM porosite p
  WHERE p.perdoruesi_id = ?
`;

db.query(q, [req.params.perdoruesi_id], (err, data) => {
  if (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ message: "Gabim në kërkimin e porosive." });
  }

  const formattedData = data.map((order) => ({
    ...order,
    artikujt: order.artikujt ? JSON.parse(`[${order.artikujt}]`) : [],
  }));

  res.status(200).json(formattedData);
});

};
