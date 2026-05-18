const { cmd } = require('../command');
const config = require('../config');
const os = require("os");

cmd({
    pattern: "alive",
    desc: "Check bot online status",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, {
    from,
    pushname,
    reply
}) => {
    try {

        const uptime = process.uptime();
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

        const aliveText = `
╭━━━〔 *🌿 SITHIJA-MD 🌿* 〕━━━⬣
┃ ⚡ *SYSTEM ONLINE*
┃ 🧬 *BOT STATUS ACTIVE*
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *📊 SYSTEM STATS* 〕━━⬣
┃ 🟢 *STATUS* : ONLINE
┃ ⚙️ *VERSION* : 1.0.0
┃ 🛡️ *MODE* : PUBLIC
┃ 🚀 *UPTIME* : ${runtime(uptime)}
┃ 📶 *PING* : ${Date.now() - mek.messageTimestamp * 1000}ms
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *👑 OWNER INFO* 〕━━⬣
┃ 👤 *OWNER* : SITHIJA
┃ 🌐 *LIBRARY* : BAILEYS
┃ 📍 *LOCATION* : SRI LANKA
┃ 💻 *NODE JS* : ${process.version}
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *🖥️ SERVER INFO* 〕━━⬣
┃ 🍀 *RAM USED* : ${ramUsage} MB
┃ 💾 *TOTAL RAM* : ${totalRam} GB
┃ 🔋 *FREE RAM* : ${usedRam} GB
╰━━━━━━━━━━━━━━━⬣

✅ Use *.menu* To Open Commands
✅ Use *.owner* For Support

> 🌿 POWERED BY SITHIJA-MD
`;

        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: aliveText
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
