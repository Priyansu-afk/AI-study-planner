const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  completedTasks: [{ taskId: String, title: String }],
  skippedTasks: [{ taskId: String, title: String }],
  streak: { type: Number, default: 0 },
});

module.exports = mongoose.model('Progress', progressSchema);
