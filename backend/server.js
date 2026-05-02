require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

// Import routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));

const PORT = process.env.PORT || 7000;

// Remove the strict connection error block for initial scaffolding mode
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI provided. Running without database for UI testing.');
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
