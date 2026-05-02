const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  planData: { type: Object, required: true }, // Store AI generated JSON structure
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
