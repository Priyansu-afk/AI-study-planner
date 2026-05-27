const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('./authMiddleware');

router.get('/stats', authMiddleware, progressController.getProgressStats);

module.exports = router;
