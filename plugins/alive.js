const { cmd } = require('../command');
const config = require('../config');
const os = require("os");

cmd({
    pattern: "alive",
    desc: "Bot Status",
    category: "main",
    react: "🧬",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply
}) => {

    try {

        const uptime = process.uptime();
        const ping = Date.now() - mek.messageTimestamp * 1000;
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const alive = `
🎋┃ *S I T H I J A - M D* | v1.0 🎋┃

🌿 👋 *SYSTEM ONLINE! YOUR BOT*
*IS RUNNING PERFECTLY*

╭───────────────❍
│ *S Y S T E M  S T A T S*
│
│ 📗 *STATUS* : ONLINE
│ 💻 *VERSION* : 1.0.0
│ 🛡️ *MODE* : PUBLIC
│ ⚡ *LATENCY* : ${ping}ms
│ ⏳ *UPTIME* : ${runtime(uptime)}
╰───────────────❍

╭───────────────❍
│ *O W N E R  C O N T E X T*
│
│ 👤 *OWNER* : SITHIJA
│ 🌿 *LIBRARY* : BAILEYS
│ 🌐 *WEB* : github.com
│ 📍 *LOCATION* : SRI LANKA
╰───────────────❍

╭───────────────❍
│ *S E R V E R  I N F O*
│
│ 🍀 *RAM* : ${ram}MB
│ 🪴 *NODE* : ${process.version}
│ 💻 *PLATFORM* : ${os.platform()}
╰───────────────❍

✅ Use *.menu* to access commands
✅ Use *.owner* for support

> ⚡ POWERED BY SITHIJA-MD
`;

        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: alive
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

function runtime(seconds) {
    seconds = Number(seconds);

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + "d " : "";
    const hDisplay = h > 0 ? h + "h " : "";
    const mDisplay = m > 0 ? m + "m " : "";
    const sDisplay = s > 0 ? s + "s" : "";

    return dDisplay + hDisplay + mDisplay + sDisplay;
}
