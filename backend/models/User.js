const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  // phone: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);


