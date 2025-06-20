const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const sendEmailOTP = require('../utils/sendEmailOTP');
const sendSMSOTP = require('../utils/sendSMSOTP');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // token expires in 7 days
  });
};


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// Register User & send OTP
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!email && !phone) return res.status(400).json({ message: 'Email or Phone required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Create user (unverified)
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    // Generate and save OTP
    const otpCode = generateOTP();
    const contact = email || phone;
    const otp = new OTP({
      contact,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });
    await otp.save();

    // Send OTP via correct channel
    email ? await sendEmailOTP(email, otpCode) : await sendSMSOTP(phone, otpCode);

    res.status(201).json({ message: 'OTP sent', contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { contact, otp } = req.body;

  try {
    const record = await OTP.findOne({ contact }).sort({ createdAt: -1 });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Update user as verified
    await User.findOneAndUpdate({ $or: [{ email: contact }, { phone: contact }] }, { isVerified: true });

    // Delete OTP
    await OTP.deleteMany({ contact });

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { contact, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: contact }, { phone: contact }] });

    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.isVerified) return res.status(403).json({ message: 'Please verify OTP first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = generateToken(user._id);
    // TODO: Generate JWT if needed
    res.json({ message: 'Login successful',token, user: { name: user.name, email: user.email || null, phone: user.phone || null } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
