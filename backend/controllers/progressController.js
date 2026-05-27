const Progress = require('../models/Progress');
const User = require('../models/User');

exports.getProgressStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    // Get last 7 days of progress for a chart (optional but good for "dashboard increasing")
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const progressHistory = await Progress.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    res.json({
      streak: user.streak || 0,
      history: progressHistory,
      totalCompleted: await Progress.countDocuments({ userId }) // Simplification
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress stats', error: error.message });
  }
};
