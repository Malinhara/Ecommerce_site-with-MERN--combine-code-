const { Log } = require('../model/Log model'); // Import the Log model from db.js
const getUserIp = require('./ipLogger'); // Import the IP logger module
const { Client } = require('@elastic/elasticsearch'); // Import Elasticsearch client
const fs = require('fs');

const esClient = new Client({
    node: 'https://elastic:VY92OKLh=C-odQ53oVFM@localhost:9200',
    tls: {
      rejectUnauthorized: false, // This will bypass certificate validation
      ca: fs.readFileSync('./LogFile/http_ca.crt'), // Optional: Include CA cert if needed
    },
});


class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }

  async log(req, message, userId = 'Unknown User', userEmail = 'Unknown Email') {
    const ipAddress = getUserIp(req); // Get IP address from the request
    const timestamp = new Date().toISOString();

    // Sanitize userId and userEmail
    const sanitizedUserId = userId || 'Unknown User';
    const sanitizedUserEmail = userEmail || 'Unknown Email';

    const logMessage = `[${timestamp}] [UserID: ${sanitizedUserId}] [UserEmail: ${sanitizedUserEmail}] [IP: ${ipAddress}] ${message}`;

    // Write the log message to the console
    console.log(logMessage);

    // Save the log message to MongoDB
    try {
      const logEntry = new Log({ 
        userId: sanitizedUserId, 
        userEmail: sanitizedUserEmail,
        ipAddress, 
        message 
      });
      await logEntry.save();
      console.log('Log saved to MongoDB');
    } catch (err) {
      console.error('Error saving log to MongoDB:', err);
    }

    // Index the log message into Elasticsearch
    try {
      await esClient.index({
        index: 'logs', // Specify your index name (change 'logs' to your preferred index name)
        body: {
          timestamp,
          userId: sanitizedUserId,
          userEmail: sanitizedUserEmail,
          ipAddress,
          message,
        },
      });
      console.log('Log indexed in Elasticsearch');
    } catch (err) {
      console.error('Error indexing log in Elasticsearch:', err);
    }
  }

  async verifyElasticsearchConnection() {
    try {
      // Elasticsearch Connection Test
      const esPing = await esClient.ping();
      if (esPing) {
        console.log('Elasticsearch connection verified successfully.');
      } else {
        console.error('Elasticsearch ping failed.');
      }
    } catch (err) {
      console.error('Error verifying Elasticsearch connection:', err);
    }
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

module.exports = Logger.getInstance();
