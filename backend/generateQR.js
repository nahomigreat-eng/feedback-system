const QRCode = require("qrcode");
const mongoose = require("mongoose");
const Counter = require("./models/Counter");
require("dotenv").config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Get next ID
async function getNextId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "customerId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return "CUST" + String(counter.value).padStart(3, "0");
}

// Generate QR (IMPORTANT: DYNAMIC SYSTEM VERSION)
async function generateQR() {
  try {
    const customerId = await getNextId();

    // 🔥 IMPORTANT CHANGE (DYNAMIC SYSTEM)
    // QR should NOT contain customerId anymore
    const url = "https://your-backend.onrender.com/scan";

    await QRCode.toFile(`qr-${customerId}.png`, url);

    console.log("✅ QR generated successfully!");
    console.log("Customer ID:", customerId);
    console.log("QR URL:", url);

  } catch (error) {
    console.error("❌ Error generating QR:", error);
  }
}

generateQR();