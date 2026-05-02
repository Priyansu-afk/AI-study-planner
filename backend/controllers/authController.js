const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('Register request body:', req.body);
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('CRITICAL Registration Error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};

exports.login = async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('CRITICAL Login Error:', error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
};
