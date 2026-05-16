const QRCode = require("qrcode");
const mongoose = require("mongoose");
const Counter = require("./models/Counter");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

// Connect DB FIRST and WAIT
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Get next ID
async function getNextId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "customerId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return "CUST" + String(counter.value).padStart(3, "0");
}

// Generate QR
async function generateQR() {
  try {
    const customerId = await getNextId();

    const url =
      "https://feedback-system-nrtf.onrender.com/scan";

    await QRCode.toFile(`qr-${customerId}.png`, url);

    console.log("✅ QR generated successfully!");
    console.log("Customer ID:", customerId);
    console.log("QR URL:", url);

  } catch (error) {
    console.error("❌ Error generating QR:", error);
  }
}

// MAIN FLOW (IMPORTANT FIX)
(async () => {
  await connectDB();
  await generateQR();
  mongoose.connection.close();
})();