require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  await Admin.create({
    username: "admin",
    password: hashed
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();