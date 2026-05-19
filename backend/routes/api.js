const express = require('express');
const router = express.Router();
const EventEmitter = require('events');
const Lead = require('../models/Lead');
const Provider = require('../models/Provider');
const WebhookLog = require('../models/WebhookLog');
const AuditLog = require('../models/AuditLog');
const { allocateProviders } = require('../services/leadAllocator');

// SSE Emitter
const dashboardEmitter = new EventEmitter();

// Auth Routes (Mock for Demo)
router.post('/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({ token: 'mock-jwt-token', user: { email } });
});

router.post('/auth/register', (req, res) => {
  const { email } = req.body;
  res.json({ token: 'mock-jwt-token', user: { email } });
});


// Feature 1 & 2: Public Customer Form & Distribution
router.post('/leads', async (req, res) => {
  try {
    const { name, phone, city, service, description } = req.body;

    // Try creating the lead to test unique constraint
    const lead = new Lead({ name, phone, city, service, description });
    try {
      await lead.save();
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate lead. This phone number has already submitted an enquiry for this service.' });
      }
      throw err;
    }

    // Assign providers
    const assignedProviders = await allocateProviders(service);

    // Update lead with assigned providers
    lead.assignedProviders = assignedProviders;
    await lead.save();

    // Log the assignment
    const logEntry = new AuditLog({
      action: 'LEAD_ASSIGNED',
      details: { leadId: lead._id, providers: assignedProviders, service }
    });
    await logEntry.save();

    // Notify Dashboard
    dashboardEmitter.emit('update');
    dashboardEmitter.emit('log', { message: `Lead ${lead.name} assigned to providers: [${assignedProviders.join(', ')}]`, timestamp: logEntry.timestamp });

    res.status(201).json({ message: 'Lead created successfully', assignedProviders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature 3: Provider Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ providerId: 1 });
    const leads = await Lead.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(50); // Get recent 50 pending leads
    res.json({ providers, leads });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Feature 4: Real-Time Dashboard Update (SSE)
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendUpdate = () => {
    res.write(`data: update\n\n`);
  };

  const sendLog = (logData) => {
    res.write(`event: log\ndata: ${JSON.stringify(logData)}\n\n`);
  };

  dashboardEmitter.on('update', sendUpdate);
  dashboardEmitter.on('log', sendLog);

  req.on('close', () => {
    dashboardEmitter.removeListener('update', sendUpdate);
    dashboardEmitter.removeListener('log', sendLog);
  });
});

// Feature 5: Webhook Simulation (Idempotent)
router.post('/webhook/reset-quota', async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: 'eventId is required for idempotency' });

    // Check idempotency
    const existingLog = await WebhookLog.findOne({ eventId });
    if (existingLog) {
      return res.status(200).json({ message: 'Webhook already processed' });
    }

    // Reset quotas
    await Provider.updateMany({}, { quota: 10 });

    // Log the event
    await WebhookLog.create({ eventId });
    
    const auditLog = new AuditLog({ action: 'QUOTA_RESET', details: { eventId } });
    await auditLog.save();

    dashboardEmitter.emit('update');
    dashboardEmitter.emit('log', { message: `Webhook processed. Quotas reset to 10. EventID: ${eventId}`, timestamp: auditLog.timestamp });

    res.status(200).json({ message: 'Quotas reset successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: 'Webhook already processed' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature 5: Generate 10 leads instantly to test concurrency
router.post('/test/generate-leads', async (req, res) => {
  try {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      const phone = `9999999${Math.floor(100 + Math.random() * 900)}`;
      const service = ['Service 1', 'Service 2', 'Service 3'][Math.floor(Math.random() * 3)];
      
      const p = (async () => {
        try {
          const lead = new Lead({ 
            name: `Test User ${i}`, 
            phone, 
            city: 'Test City', 
            service, 
            description: 'Concurrency Test' 
          });
          await lead.save();
          const assignedProviders = await allocateProviders(service);
          lead.assignedProviders = assignedProviders;
          await lead.save();
        } catch (err) {
          // Ignore duplicate errors during random generation
        }
      })();
      promises.push(p);
    }
    
    await Promise.all(promises);
    dashboardEmitter.emit('update');
    dashboardEmitter.emit('log', { message: '10 leads generated simultaneously.', timestamp: new Date() });
    
    res.status(200).json({ message: '10 leads generated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature 6: Custom Leads Generation
router.post('/test/generate-custom-leads', async (req, res) => {
  try {
    const { count, burst } = req.body;
    let numLeads = parseInt(count) || 1;
    if (numLeads > 100) numLeads = 100; // Cap at 100

    const generateLead = async (i) => {
      try {
        const phone = `9999999${Math.floor(100 + Math.random() * 900)}`;
        const service = ['Service 1', 'Service 2', 'Service 3'][Math.floor(Math.random() * 3)];
        
        const lead = new Lead({ 
          name: `Custom Lead ${Date.now()}_${i}`, 
          phone, 
          city: 'Test City', 
          service, 
          description: 'Custom Test' 
        });
        await lead.save();
        const assignedProviders = await allocateProviders(service);
        lead.assignedProviders = assignedProviders;
        await lead.save();

        const logEntry = new AuditLog({
          action: 'LEAD_ASSIGNED',
          details: { leadId: lead._id, providers: assignedProviders, service }
        });
        await logEntry.save();
        
        dashboardEmitter.emit('update');
        dashboardEmitter.emit('log', { message: `Custom lead ${i+1}/${numLeads} generated and assigned.`, timestamp: logEntry.timestamp });
      } catch (err) {
        // Ignore duplicate errors during random generation
      }
    };

    if (burst) {
      const promises = [];
      for (let i = 0; i < numLeads; i++) {
        promises.push(generateLead(i));
      }
      await Promise.all(promises);
    } else {
      for (let i = 0; i < numLeads; i++) {
        await generateLead(i);
        await new Promise(r => setTimeout(r, 500)); // 500ms delay between leads
      }
    }
    
    res.status(200).json({ message: `${numLeads} custom leads generated.` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature 7: Error / Chaos Simulation
router.post('/test/simulate-error', async (req, res) => {
  try {
    const { type } = req.body;
    
    if (type === 'db_timeout') {
      dashboardEmitter.emit('log', { message: 'Simulating DB Timeout...', timestamp: new Date() });
      await new Promise(r => setTimeout(r, 5000)); // 5 second block
      dashboardEmitter.emit('log', { message: 'DB Timeout simulation complete.', timestamp: new Date() });
      return res.status(200).json({ message: 'Simulated 5s DB block' });
    }
    
    if (type === 'webhook_fail') {
      dashboardEmitter.emit('log', { message: 'Simulated Webhook Failure (500).', timestamp: new Date(), isError: true });
      return res.status(500).json({ error: 'Simulated internal server error in webhook' });
    }

    res.status(400).json({ error: 'Unknown error type' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete Lead
router.put('/leads/:id/complete', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: 'completed' });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    dashboardEmitter.emit('update');
    res.json({ message: 'Lead marked as completed' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Lead
router.delete('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    dashboardEmitter.emit('update');
    res.json({ message: 'Lead deleted permanently' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
