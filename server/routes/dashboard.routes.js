const express = require('express');
const dashboardService = require('../services/dashboard.service');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  try {
    const data = dashboardService.getDashboardData(req.session.userId);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

module.exports = router;