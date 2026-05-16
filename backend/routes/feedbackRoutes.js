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
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - rating
 *               - comment
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: CUST001
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great service"
 *               date:
 *                 type: string
 *                 example: "2026-05-16"
 *     responses:
 *       200:
 *         description: Feedback saved successfully
 *       400:
 *         description: Missing required fields (customerId, rating, or comment)
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const { customerId, rating, comment, date } = req.body;

    // VALIDATION
    if (!customerId) {
      return res.status(400).json({
        error: "Customer ID required",
      });
    }

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

    return res.status(200).json({
      message: "Feedback saved successfully",
      customerId,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

/**
 * ================= GET ALL FEEDBACK =================
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback (supports filtering)
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Filter by rating (1-5)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of feedback
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const { rating, fromDate, toDate } = req.query;

    let filter = {};

    if (rating) {
      filter.rating = Number(rating);
    }

    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        filter.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
      }
    }

    const data = await Feedback.find(filter).sort({
      createdAt: -1,
    });

    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

/**
 * ================= GET BY CUSTOMER ID =================
 * @swagger
 * /api/feedback/{customerId}:
 *   get:
 *     summary: Get feedback by customer ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         example: CUST001
 *     responses:
 *       200:
 *         description: Customer feedback list
 *       500:
 *         description: Server error
 */
router.get("/:customerId", async (req, res) => {
  try {
    const data = await Feedback.find({
      customerId: req.params.customerId,
    });

    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;