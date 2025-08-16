// app.js
console.log("App is starting...");
require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./config/db'); // Database connection
const { swaggerUi, specs } = require('./swagger');

app.use(express.json()); // Parse JSON requests
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Import Routes
const voterRoutes = require('./routes/votersRoutes');
const candidateRoutes = require('./routes/candidatesRoutes');
const electionRoutes = require('./routes/electionsRoutes');
const voteRoutes = require('./routes/votesRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Register Routes
app.use('/api/voters', voterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Export app for tests
module.exports = app;
