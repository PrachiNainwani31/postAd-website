const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  contact: String, // email or phone
  otp: String,
  expiresAt: Date
});

module.exports = mongoose.model('OTP', otpSchema);
