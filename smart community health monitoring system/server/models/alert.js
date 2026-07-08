const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String }, // Redundancy for quick display
  type: { type: String, required: true }, // e.g., "High Heart Rate", "Low SpO2"
  severity: { type: String, enum: ['Warning', 'Emergency'], default: 'Emergency' },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
