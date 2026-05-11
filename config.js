const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "kMFnjBoI#UAjw5i-FJ6FCtxTv3jso8dAeSELPx0xouNdXdET3X0E",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/ChatGPT%20Image%20May%2010,%202026,%2007_16_34%20PM.png?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG ||ALIVE_MSG: process.env.ALIVE_MSG || `
✨ Hello, SITHIJA MD is now alive and running successfully! 🚀
╭━━━〔 *SITHIJA MD* 〕━━━⬣
┃ ⚡ Status : Online
┃ 👑 Owner : Sithija
╰━━━━━━━━━━━━━━━━━━⬣
`,
`",
BOT_OWNER: '94785936039',  // Replace with the owner's phone number



};
