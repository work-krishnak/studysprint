const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('./db/db');

const authRoutes = require('./routes/auth.routes');
const assignmentsRoutes = require('./routes/assignments.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve the built React frontend in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our end. Please try again.' });
});

module.exports = app;