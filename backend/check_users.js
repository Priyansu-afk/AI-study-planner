const mongoose = require('mongoose');
const User = require('./models/User');
const StudyPlan = require('./models/StudyPlan');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({}, 'name email isVerified');
    console.log('Current Users:', users);
    const plans = await StudyPlan.find({});
    console.log('Current Plans Count:', plans.length);
    if (plans.length > 0) {
        console.log('Sample Plan:', JSON.stringify(plans[0], null, 2));
    }
    process.exit();
  });
