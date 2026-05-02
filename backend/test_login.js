const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function testLogin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/studyplan');
  const user = await User.findOne({ email: 'lol@gmail.com' });
  if (!user) {
    console.log('User not found');
    process.exit();
  }
  console.log('User found. Hashed password:', user.password);
  const isMatch = await user.comparePassword('456123789');
  console.log('Match result:', isMatch);
  process.exit();
}
testLogin();
