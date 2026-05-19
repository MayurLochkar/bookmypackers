const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  providerId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  quota: { type: Number, default: 10 },
  leadsReceived: { type: Number, default: 0 }
});

module.exports = mongoose.model('Provider', providerSchema);
