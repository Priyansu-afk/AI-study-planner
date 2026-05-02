const StudyPlan = require('../models/StudyPlan');
const Goal = require('../models/Goal');

// Mock AI Plan Generation for now (You can plug in Google Gemini here later)
exports.generatePlan = async (req, res) => {
  try {
    const { targetArea, deadline, skillLevel, dailyStudyTime } = req.body;
    
    // 1. Save the User's Goal
    const goal = new Goal({
      userId: req.user.userId,
      targetArea,
      deadline,
      skillLevel,
      dailyStudyTime
    });
    await goal.save();

    const mockPlan = {
      days: [
        { 
          day: 1, 
          title: `Intro to ${targetArea}`, 
          tasks: [
            { title: 'Read documentation for 30m', completed: false, time: '30 min', type: 'Theory' },
            { title: 'Complete 2 basic coding exercises', completed: false, time: '45 min', type: 'DSA' }
          ] 
        },
        { 
          day: 2, 
          title: `Core Concepts`, 
          tasks: [
            { title: 'Watch community tutorial', completed: false, time: '20 min', type: 'Learning' },
            { title: 'Implement a basic feature', completed: false, time: '60 min', type: 'Project' }
          ] 
        },
      ],
      estimatedCompletion: deadline
    };

    // 3. Save the Study Plan
    const studyPlan = new StudyPlan({
      userId: req.user.userId,
      goalId: goal._id,
      planData: mockPlan
    });
    await studyPlan.save();

    res.status(201).json({ message: 'Plan generated successfully', plan: studyPlan });
  } catch (error) {
    res.status(500).json({ message: 'Error generating plan', error: error.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user.userId }).populate('goalId');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};
exports.updateTaskStatus = async (req, res) => {
  try {
    const { planId, dayIndex, taskIndex, completed } = req.body;
    const plan = await StudyPlan.findOne({ _id: planId, userId: req.user.userId });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Update the nested JSON structure
    plan.planData.days[dayIndex].tasks[taskIndex].completed = completed;
    
    // Mongoose needs to be notified of the deep modification
    plan.markModified('planData');
    await plan.save();
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};
