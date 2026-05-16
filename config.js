const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "IJcXXb7S#xBHXbz0-ZydIEGzPIUXowGfIpxAuayghKEwML4n8qIY",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/alive.png?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG || "*✨ Hello, SITHIJA MD is now alive and running successfully! 🚀*",
    
BOT_OWNER: '94785936039',  // Replace with the owner's phone number
AUTO_STATUS_SEEN: 'true',
AUTO_STATUS_REACT: 'true',
ANTI_DELETE: true,

};
