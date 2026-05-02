const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetArea: { type: String, required: true }, // e.g., 'dsa', 'exams', 'skills'
  deadline: { type: Date, required: true },
  skillLevel: { type: String, required: true },
  dailyStudyTime: { type: Number, required: true }, // hours
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);
