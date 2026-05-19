const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  service: { type: String, required: true },
  description: { type: String },
  assignedProviders: [{ type: Number }], // Store providerIds
  status: { type: String, default: 'pending' }, // 'pending', 'completed'
  createdAt: { type: Date, default: Date.now }
});

// Enforce duplicate rule at DB level
leadSchema.index({ phone: 1, service: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);
