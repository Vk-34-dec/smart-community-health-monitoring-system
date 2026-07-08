const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// PATCH /api/appointments/:id
// Light-weight endpoint: accepts { status } and returns success.
router.patch('/:id', auth, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Missing status' });
  // For now this is a stub: log and respond. Could persist to DB later.
  console.log(`Appointment ${req.params.id} set to ${status} by user ${req.user && req.user.id}`);
  return res.json({ ok: true, id: req.params.id, status });
});

module.exports = router;
