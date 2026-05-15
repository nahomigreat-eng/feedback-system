const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    customerId: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Feedback", feedbackSchema);