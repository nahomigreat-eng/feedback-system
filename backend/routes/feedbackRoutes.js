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
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback saved successfully
 */
router.post("/", async (req, res) => {
  try {
    const { customerId, rating, comment, date } = req.body;

    if (!customerId) return res.status(400).json({ error: "Customer ID required" });
    if (!comment || comment.trim() === "") return res.status(400).json({ error: "Comment required" });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });

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
      customerId,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ================= GET FEEDBACK =================
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of feedback
 */
router.get("/", auth, async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
 *     responses:
 *       200:
 *         description: Customer feedback list
 */
router.get("/:customerId", auth, async (req, res) => {
  try {
    const data = await Feedback.find({
      customerId: req.params.customerId,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;