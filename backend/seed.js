require("dotenv").config();
const mongoose = require("mongoose");
const Feedback = require("./models/Feedback");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Feedback.create([
      {
        customerId: "CUST001",
        rating: 5,
        comment: "Excellent service"
      },
      {
        customerId: "CUST002",
        rating: 4,
        comment: "Good support"
      }
    ]);

    console.log("Sample data inserted");
    process.exit();
  })
  .catch(err => console.log(err));