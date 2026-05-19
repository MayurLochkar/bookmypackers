const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'LEAD_ASSIGNED', 'QUOTA_RESET', 'ERROR_SIMULATED'
  details: { type: Object }, // Can store lead id, provider ids, etc.
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
