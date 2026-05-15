const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid username",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * @swagger
 * /api/admin/change-password:
 *   post:
 *     summary: Change admin password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid user
 *       401:
 *         description: Wrong old password
 *       500:
 *         description: Server error
 */

// ================= CHANGE PASSWORD =================
router.post("/change-password", auth, async (req, res) => {
  try {
    const {
      username,
      oldPassword,
      newPassword,
    } = req.body;

    const admin = await Admin.findOne({
      username,
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong old password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;