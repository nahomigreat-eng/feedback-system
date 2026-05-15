// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Swagger setup
const setupSwagger = require("./swagger");

const app = express();

// ================= MIDDLEWARE =================

// Enable CORS for local testing and deployment
app.use(cors());

// Parse JSON requests
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

// ================= DATABASE CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Swagger Docs: http://localhost:${PORT}/api-docs`
  );
});