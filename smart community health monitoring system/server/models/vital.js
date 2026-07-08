const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  heart_rate: { type: Number },
  spo2: { type: Number },
  temperature: { type: Number },
  blood_pressure: { type: String }, // e.g., "120/80"
  status: { type: String, enum: ['Normal', 'Warning', 'Emergency'], default: 'Normal' },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vital', VitalSchema);
