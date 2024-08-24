const mongoose = require('mongoose');

// Define a schema for log entries
const logSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  ipAddress: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Log = mongoose.model('Log', logSchema);

module.exports = { Log };
