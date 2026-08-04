const express = require('express');
const cors = require('cors');
require('./db/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;