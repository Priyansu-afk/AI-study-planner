const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const authMiddleware = require('./authMiddleware');

router.use(authMiddleware);

router.post('/generate', planController.generatePlan);
router.get('/', planController.getPlans);
router.put('/update-task', planController.updateTaskStatus);

module.exports = router;
