// models/OTP.js
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  contact: String,
  otp: String,
  expiresAt: Date,
  extra: {
    name: String,
    email: String,
    password: String
  }
}, { timestamps: true });

module.exports = mongoose.model("OTP", OTPSchema);
