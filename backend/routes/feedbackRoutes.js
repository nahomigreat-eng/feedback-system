const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");

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
    const { customerId, rating, comment, date } = req.body;

    // ✅ Customer ID required
    if (!customerId) {
      return res.status(400).json({
        error: "Customer ID required",
      });
    }

    // ✅ Comment validation
    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        error: "Comment required",
      });
    }

    // ✅ Rating validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    // ✅ Date handling
    const createdAt = date
      ? new Date(date + "T00:00:00.000Z")
      : new Date();

    // ✅ Save feedback
    const feedback = new Feedback({
      customerId,
      rating,
      comment,
      createdAt,
    });

    await feedback.save();

    // ✅ Success response
    res.json({
      message: "Feedback saved successfully",
      customerId,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

/**
 * ================= GET FEEDBACK =================
 */
router.get("/", auth, async (req, res) => {
  try {
    const { rating, fromDate, toDate } = req.query;

    let filter = {};

    // ✅ Filter by rating
    if (rating) {
      filter.rating = Number(rating);
    }

    // ✅ Filter by date range
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        filter.createdAt.$lte = new Date(
          toDate + "T23:59:59.999Z"
        );
      }
    }

    const data = await Feedback.find(filter).sort({
      createdAt: -1,
    });

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
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

    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;