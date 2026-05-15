const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const ExcelJS = require("exceljs");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Export feedback reports
 */

// ================= EXCEL EXPORT =================
router.get("/excel", auth, async (req, res) => {
  try {
    const data = await Feedback.find().lean();

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Feedback");

    sheet.columns = [
      {
        header: "Customer ID",
        key: "customerId",
        width: 20,
      },
      {
        header: "Rating",
        key: "rating",
        width: 10,
      },
      {
        header: "Comment",
        key: "comment",
        width: 40,
      },
      {
        header: "Date",
        key: "createdAt",
        width: 25,
      },
    ];

    data.forEach((item) => {
      sheet.addRow({
        customerId: item.customerId || "-",
        rating: item.rating || "-",
        comment: item.comment || "-",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "-",
      });
    });

    sheet.getRow(1).font = {
      bold: true,
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=feedback.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Excel export failed",
    });
  }
});

module.exports = router;