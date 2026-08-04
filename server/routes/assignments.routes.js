const express = require('express');
const assignmentService = require('../services/assignment.service');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  try {
    const filters = {
      course: req.query.course,
      priority: req.query.priority,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to,
      sort: req.query.sort,
    };
    const assignments = assignmentService.getAssignments(req.session.userId, filters);
    res.status(200).json({ assignments });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.post('/', (req, res) => {
  try {
    const assignment = assignmentService.createAssignment(req.session.userId, req.body);
    res.status(201).json({ assignment });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const assignment = assignmentService.updateAssignment(req.session.userId, Number(req.params.id), req.body);
    res.status(200).json({ assignment });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const assignment = assignmentService.updateStatus(req.session.userId, Number(req.params.id), req.body.status);
    res.status(200).json({ assignment });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    assignmentService.deleteAssignment(req.session.userId, Number(req.params.id));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
  }
});

module.exports = router;