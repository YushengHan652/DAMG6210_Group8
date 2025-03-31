require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import routes
const teamsRoutes = require('./routes/teams');
const driversRoutes = require('./routes/drivers');
const racesRoutes = require('./routes/races');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/teams', teamsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/races', racesRoutes);

// Serve the main HTML file for any other routes (Single Page Application approach)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});