const config = require("../config");
const { cmd, commands } = require("../command");
const os = require("os");

cmd({
    pattern: "system",
    alias: ["status", "botinfo"],
    desc: "Check bot uptime, ram usage and more",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply
}) => {
    try {

        const runtime = (seconds) => {
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
        };

        let status = `
╭━━〔 *SITHIJA MD SYSTEM* 〕━━⬣
┃ 🟢 *Status:* Online
┃ ⏰ *Uptime:* ${runtime(process.uptime())}
┃ 💾 *RAM Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃ 🖥️ *Host Name:* ${os.hostname()}
┃ 👑 *Owner:* Sithija
╰━━━━━━━━━━━━━━━━━━⬣
`;

        reply(status);

    } catch (e) {
        console.log(e);
        reply("❌ Error Found");
    }
});
