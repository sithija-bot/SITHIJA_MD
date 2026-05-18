const { cmd, commands } = require('../command');
const config = require('../config');
const os = require("os");

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    react: "🧬"
    filename: __filename
},
async (danuwamd, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);

        const speed = `${Math.floor(Math.random() * 1000)}ms`;

        const aliveMsg = `
╭━━━〔 *🎋 SITHIJA MD | v1.0.0 🎋* 〕━━━⬣

🍃 👋 *HELLO ${pushname}*
*YOUR BOT IS WORKING*
*PERFECTLY ONLINE ⚡*

╭───────────────◆
│ *S Y S T E M   S T A T S ⚯*
│
│ 📗 *STATUS :* ONLINE
│ 💽 *VERSION :* 1.0.0
│ 🛡️ *MODE :* PUBLIC
│ ⚡ *LATENCY :* ${speed}
│ ⏳ *UPTIME :* ${hours}h ${minutes}m ${seconds}s
╰───────────────◆

╭───────────────◆
│ *O W N E R   C O N T E X T ⚯*
│
│ 👤 *CODER :* SITHIJA
│ 🌿 *LIBRARY :* BAILEYS
│ 🌐 *WEB :* github.com
│ 📍 *LOCATION :* SRI LANKA
╰───────────────◆

╭───────────────◆
│ *S E R V E R   I N F O ⚯*
│
│ 🍀 *RAM :* ${ram}MB / ${totalRam}MB
│ 🪴 *NODE :* ${process.version}
╰───────────────◆

✅ *Use .menu to access the interface*
✅ *Use .owner for support*

> *SITHIJA-MD IS ONLINE NOW ⚡*
`;

        return await danuwamd.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: aliveMsg
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
