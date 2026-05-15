const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Counter = require("../models/Counter"); // ✅ ADDED
const auth = require("../middleware/auth");

/**
 * 🔥 AUTO CUSTOMER ID GENERATOR (DATABASE-BASED)
 */
async function generateCustomerId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "customerId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return "CUST" + String(counter.value).padStart(3, "0");
}

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management APIs
 */

/**
 * ================= SUBMIT FEEDBACK =================
 */
router.post("/", async (req, res) => {
  try {
    const { rating, comment, date } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // 🔥 GENERATE UNIQUE CUSTOMER ID
    const customerId = await generateCustomerId();

    const createdAt = date
      ? new Date(date + "T00:00:00.000Z")
      : new Date();

    const feedback = new Feedback({
      customerId,
      rating,
      comment,
      createdAt,
    });

    await feedback.save();

    res.json({
      message: "Feedback saved successfully",
      customerId, // optional but useful for QR generation
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * ================= GET FEEDBACK =================
 */
router.get("/", auth, async (req, res) => {
  try {
    const { rating, fromDate, toDate } = req.query;

    let filter = {};

    if (rating) filter.rating = Number(rating);

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
    }

    const data = await Feedback.find(filter).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * ================= GET BY CUSTOMER ID =================
 */
router.get("/:customerId", auth, async (req, res) => {
  try {
    const data = await Feedback.find({
      customerId: req.params.customerId,
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;