const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.logFile = path.join(__dirname, 'app.log');
        Logger.instance = this;
    }

    log(message, userId = 'Unknown User', userName = 'Unknown Name') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [UserID: ${userId}] [UserName: ${userName}] ${message}\n`;

        // Write the log message to the console
        console.log(logMessage.trim());

        // Append the log message to the log file
        fs.appendFile(this.logFile, logMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

module.exports = Logger.getInstance();
