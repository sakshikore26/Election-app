// server.js
console.log("✅ App is starting...");
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db'); // Ensure DB connection is initialized

const { swaggerUi, specs } = require('./swagger');

// ✅ Environment Variables
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ✅ Enable CORS for frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true // if you're using cookies, sessions, etc.
}));

// ✅ JSON Parsing Middleware
app.use(express.json());

// ✅ Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ✅ API Routes
app.use('/api/voters', require('./routes/votersRoutes'));
app.use('/api/candidates', require('./routes/candidatesRoutes'));
app.use('/api/elections', require('./routes/electionsRoutes'));
app.use('/api/votes', require('./routes/votesRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🗳️ Election Management API is running...');
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
