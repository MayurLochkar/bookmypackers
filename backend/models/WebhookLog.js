const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  processedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema);
