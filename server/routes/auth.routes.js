const express = require('express');
const authService = require('../services/auth.service');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await authService.register(req.body);
    req.session.userId = user.id;
    res.status(201).json({ user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await authService.login(req.body);
    req.session.userId = user.id;
    res.status(200).json({ user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in.' });
  }
  const userRepository = require('../repository/user.repository');
  const authServiceInner = require('../services/auth.service');
  const user = userRepository.findUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: 'Not logged in.' });
  }
  res.status(200).json({ user: authServiceInner.sanitizeUser(user) });
});

module.exports = router;