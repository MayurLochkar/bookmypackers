const mongoose = require('mongoose');

const distributionStateSchema = new mongoose.Schema({
  service: { type: String, required: true, unique: true },
  lastAssignedIndex: { type: Number, default: -1 }
});

module.exports = mongoose.model('DistributionState', distributionStateSchema);
