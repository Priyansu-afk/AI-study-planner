const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/studyplan');
  const users = await User.find({});
  console.log('Current Users:', users.map(u => ({ name: u.name, email: u.email })));
  process.exit();
}
check();
