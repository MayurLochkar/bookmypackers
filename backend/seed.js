const mongoose = require('mongoose');
const Provider = require('./models/Provider');
const DistributionState = require('./models/DistributionState');

async function seedDatabase() {
  const providerNames = [
    'Rahul - Plumber',
    'Amit - Electrician',
    'Neha - Carpenter',
    'Priya - Cleaner',
    'Vikram - Painter',
    'Rohan - AC Repair',
    'Sonia - Pest Control',
    'Karan - Gardener'
  ];

  // Seed Providers
  for (let i = 1; i <= 8; i++) {
    await Provider.findOneAndUpdate(
      { providerId: i },
      { $set: { name: providerNames[i - 1] } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  // Seed Distribution States
  const services = ['Service 1', 'Service 2', 'Service 3'];
  for (const service of services) {
    await DistributionState.findOneAndUpdate(
      { service },
      { service },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Seed data inserted successfully.');
}

module.exports = seedDatabase;
