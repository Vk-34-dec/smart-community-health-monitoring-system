const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vital = require('../models/Vital');
const Alert = require('../models/Alert');
const Patient = require('../models/Patient');

// GET /api/vitals/:patientId - get history for a patient
router.get('/:patientId', auth, async (req, res) => {
  try {
    const vitals = await Vital.find({ patient: req.params.patientId }).sort({ recordedAt: -1 }).limit(50);
    res.json(vitals);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST /api/vitals - record new vitals
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, heart_rate, spo2, temperature, blood_pressure } = req.body;

    // Simple logic to determine status
    let status = 'Normal';
    if (heart_rate > 110 || heart_rate < 50 || spo2 < 92 || temperature > 39) {
      status = 'Emergency';
    } else if (heart_rate > 100 || spo2 < 95 || temperature > 37.5) {
      status = 'Warning';
    }

    const vital = new Vital({
      patient: patientId,
      heart_rate,
      spo2,
      temperature,
      blood_pressure,
      status
    });

    await vital.save();

    // Create alert if emergency
    if (status === 'Emergency') {
      const patient = await Patient.findById(patientId);
      let trigger = [];
      if (heart_rate > 110) trigger.push('High Heart Rate');
      if (heart_rate < 50) trigger.push('Low Heart Rate');
      if (spo2 < 92) trigger.push('Low SpO2');
      if (temperature > 39) trigger.push('High Fever');

      const alert = new Alert({
        patient: patientId,
        patientName: patient ? patient.name : 'Unknown',
        type: trigger.join(', '),
        message: `${trigger.join(' and ')} detected for ${patient ? patient.name : 'Patient'}.`,
        severity: 'Emergency'
      });
      await alert.save();
    }

    res.json(vital);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
