const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');

// GET /api/patients - list patients (protected)
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 }).limit(100);
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/patients - create patient (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, age, gender, contact, address } = req.body;
    const patient = new Patient({ name, age, gender, contact, address });
    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/patients/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/patients/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/patients/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
