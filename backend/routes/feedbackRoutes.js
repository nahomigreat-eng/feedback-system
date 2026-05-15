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
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback
 *     tags: [Feedback]
 */

// ================= SUBMIT FEEDBACK =================
router.post("/", async (req, res) => {
  try {
    const { customerId, rating, comment, date } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        error: "Comment required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

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
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get feedback with filters
 *     tags: [Feedback]
 */

// ================= GET FEEDBACK =================
router.get("/", auth, async (req, res) => {
  try {
    const { rating, fromDate, toDate } = req.query;

    let filter = {};

    // Rating filter
    if (rating) {
      filter.rating = Number(rating);
    }

    // Date filter
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
 * @swagger
 * /api/feedback/{customerId}:
 *   get:
 *     summary: Get feedback by customer ID
 *     tags: [Feedback]
 */

// ================= GET BY CUSTOMER ID =================
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