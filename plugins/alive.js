const { cmd, commands } = require('../command');
const config = require('../config');
const os = require("os");

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    react: "👑",
    filename: __filename
},
async (danuwa, mek, m, {
    from, pushname, reply
}) => {
    try {

        const uptime = process.uptime();

        function runtime(seconds) {
            seconds = Number(seconds);

            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor(seconds % (3600 * 24) / 3600);
            const m = Math.floor(seconds % 3600 / 60);
            const s = Math.floor(seconds % 60);

            const dDisplay = d > 0 ? d + " Day, " : "";
            const hDisplay = h > 0 ? h + " Hour, " : "";
            const mDisplay = m > 0 ? m + " Minute, " : "";
            const sDisplay = s > 0 ? s + " Second" : "";

            return dDisplay + hDisplay + mDisplay + sDisplay;
        }

        const aliveMsg = `
╭━━━〔 *SITHIJA-MD* 〕━━━⬣
┃ ✋ HI, *${pushname}* I'M ALIVE NOW 👑
┃
 ┣━━━〔 📅 DATE INFORMATION 〕━━⬣
┃ 📆 Date : ${new Date().toLocaleDateString()}
┃
 ┣━━━〔 ⚙️ STATUS DETAILS 〕━━⬣
┃ 👤 User : ${pushname}
┃ 🔖 Prefix : ${config.PREFIX}
┃ 🧬 Version : 1.0.0
┃ 💻 Platform : ${os.platform()}
┃ 🛰️ Host : Railway
┃ ⏳ Uptime : ${runtime(uptime)}
┃ 📁 RAM : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃
 ┣━━━〔 📜 MAIN COMMANDS 〕━━⬣
┃ 💎 .menu
┃ 💎 .alive
┃ 💎 .ping
┃ 💎 .owner
┃
╰━━━━━━━━━━━━━━━━━━⬣
> POWERED BY SITHIJA-MD
`;

        return await danuwa.sendMessage(
            from,
            {
                image: { url: config.ALIVE_IMG },
                caption: aliveMsg
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
