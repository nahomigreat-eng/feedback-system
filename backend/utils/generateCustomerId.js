const Counter = require("../models/Counter");

async function generateCustomerId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "customerId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const number = counter.value;

  return "CUST" + String(number).padStart(3, "0");
}

module.exports = generateCustomerId;