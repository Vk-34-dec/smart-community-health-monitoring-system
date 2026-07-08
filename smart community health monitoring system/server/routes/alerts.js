const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

// GET /api/alerts - get all alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20);
    res.json(alerts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PATCH /api/alerts/:id/read - mark alert as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(alert);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
