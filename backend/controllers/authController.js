const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  console.log('Register request body:', req.body);
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (user && !user.isVerified) {
      // Update unverified user
      user.name = name;
      user.password = password; // Will be hashed by pre-save hook
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create new user
      user = new User({ name, email, password, otp, otpExpiry });
      await user.save();
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Study Planner OTP Verification',
      text: `Your OTP for registration is ${otp}. It is valid for 5 minutes.`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Email sending error:', mailError);
      return res.status(500).json({ message: 'Error sending OTP email' });
    }

    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (error) {
    console.error('CRITICAL Registration Error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.status(200).json({ message: 'Account verified successfully', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Study Planner OTP Verification (Resend)',
      text: `Your new OTP for registration is ${otp}. It is valid for 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP resent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

exports.login = async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('CRITICAL Login Error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};
