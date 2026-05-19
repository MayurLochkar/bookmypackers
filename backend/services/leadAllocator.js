const Provider = require('../models/Provider');
const DistributionState = require('../models/DistributionState');

const RULES = {
  'Service 1': {
    mandatory: [1],
    pool: [2, 3, 4]
  },
  'Service 2': {
    mandatory: [5],
    pool: [6, 7, 8]
  },
  'Service 3': {
    mandatory: [1, 4],
    pool: [2, 3, 5, 6, 7, 8]
  }
};

async function allocateProviders(service) {
  const rule = RULES[service];
  if (!rule) throw new Error("Invalid service");

  const assignedProviders = [];

  // Step 1: Assign Mandatory Providers (if quota > 0)
  for (const pid of rule.mandatory) {
    const updated = await Provider.findOneAndUpdate(
      { providerId: pid, quota: { $gt: 0 } },
      { $inc: { quota: -1, leadsReceived: 1 } },
      { new: true }
    );
    if (updated) {
      assignedProviders.push(pid);
    }
  }

  // Step 2: Fill remaining slots fairly
  let remainingSlots = 3 - assignedProviders.length;
  if (remainingSlots <= 0) return assignedProviders;

  const pool = rule.pool;
  let attempts = 0;
  
  while (remainingSlots > 0 && attempts < pool.length * 2) { 
    attempts++;
    
    const state = await DistributionState.findOneAndUpdate(
      { service },
      { $inc: { lastAssignedIndex: 1 } },
      { new: true, upsert: true }
    );
    
    // Prevent negative modulo bug in JS, just in case
    let currentIdx = state.lastAssignedIndex;
    if(currentIdx < 0) currentIdx = 0;
    
    const index = currentIdx % pool.length;
    const pid = pool[index];
    
    if (assignedProviders.includes(pid)) continue;
    
    const updated = await Provider.findOneAndUpdate(
      { providerId: pid, quota: { $gt: 0 } },
      { $inc: { quota: -1, leadsReceived: 1 } },
      { new: true }
    );
    
    if (updated) {
      assignedProviders.push(pid);
      remainingSlots--;
    }
  }

  return assignedProviders;
}

module.exports = { allocateProviders };
