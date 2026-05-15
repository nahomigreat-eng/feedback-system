require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Counter = require("./models/Counter");

const setupSwagger = require("./swagger");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= SWAGGER =================
setupSwagger(app);

// ================= ROUTES =================
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= DYNAMIC QR SCAN ROUTE =================
app.get("/scan", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "customerId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const customerId =
      "CUST" + String(counter.value).padStart(3, "0");

    const redirectUrl =
      `https://feedback-system-fawn-theta.vercel.app/feedback?customerId=${customerId}`;

    console.log("Scan success → redirecting to:", redirectUrl);

    // IMPORTANT: use explicit redirect status
    return res.redirect(302, redirectUrl);

  } catch (error) {
    console.error("Scan error:", error);

    return res.status(500).send("Scan failed. Please try again.");
  }
});

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.error("DB connection error:", err));

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});