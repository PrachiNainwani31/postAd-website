const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const sendEmailOTP = require('../utils/sendEmailOTP');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Validate token and return user
exports.validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ valid: false, message: "User not found" });

    res.json({ valid: true, user });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

// Register: Send OTP only
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    if (email === 'prachinainwnai31@gmail.com') {
  return res.status(403).json({ message: 'Admin cannot register from frontend' });
}

    const otpCode = generateOTP();

    // Store in OTP model temporarily
    await OTP.deleteMany({ contact: email }); // Remove any existing OTP
    await OTP.create({
      contact: email,
      otp: otpCode,
      extra: { name, email, password: await bcrypt.hash(password, 10) },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmailOTP(email, otpCode);
    res.status(201).json({ message: 'OTP sent to email', contact: email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and create user
exports.verifyOtp = async (req, res) => {
  const { contact, otp } = req.body;
  console.log("VERIFY OTP request body:", req.body);

  if (email === 'prachinainwnai31@gmail.com') {
  return res.status(403).json({ message: 'Admin cannot verify OTP from frontend' });
}

  try {
    const record = await OTP.findOne({ contact }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(400).json({ message: 'No OTP found' });
    }

    console.log("Stored OTP:", record.otp, "Provided:", otp);

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const already = await User.findOne({ email: contact });
    if (already) {
      await OTP.deleteMany({ contact });
      return res.status(400).json({ message: 'User already exists' });
    }

    const { name, email, password } = record.extra;
    const user = await User.create({ name, email, password, role: 'user', isVerified: true });
    await OTP.deleteMany({ contact });

    const token = generateToken(user._id);
    return res.json({ message: 'OTP verified', token, user });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify OTP first' });

     if (email === 'prachinainwnai31@gmail.com') {
  if (user.role !== 'admin') {
    user.role = 'admin';
    await user.save(); // Save updated role to DB
  }
}
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = generateToken(user._id);
    res.json({
  message: 'Login successful',
  token,
  user: { _id: user._id, name: user.name, email: user.email,role:user.role } // ✅ include _id!
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 1: Forgot Password - send OTP only if email exists
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email))
    return res.status(400).json({ message: 'Invalid email format' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not registered' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.deleteMany({ contact: email });
  await OTP.create({
    contact: email,
    otp,
    extra: { userId: user._id },
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  await sendEmailOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
};

// Step 2: Reset Password using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields required' });

  const record = await OTP.findOne({ contact: email }).sort({ createdAt: -1 });
  if (!record || record.otp !== otp) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(record.extra.userId, { password: hashed });
  await OTP.deleteMany({ contact: email });
  res.json({ message: 'Password reset successful' });
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



