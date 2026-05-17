const { cmd } = require("../command");
const os = require("os");
const moment = require("moment");

cmd(
{
    pattern: "alive",
    desc: "Check bot online status",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

try {

const uptime = process.uptime();

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

const aliveMsg = `
╭━━〔 *SITHIJA-MD* 〕━━⬣
┃ ✋ HI, *I AM ALIVE NOW*
┃
┣━━〔 📅 DATE INFO 〕━━⬣
┃ 📆 Date : ${moment().format("DD/MM/YYYY")}
┃ ⏰ Time : ${moment().format("HH:mm:ss")}
┃
┣━━〔 ⚙️ STATUS INFO 〕━━⬣
┃ 👤 Owner : Sithija
┃ 🔖 Prefix : .
┃ 🧬 Version : v1.0.0
┃ 💻 Platform : ${os.platform()}
┃ 🛰️ Host : VPS/Cloud
┃ ⏳ Uptime : ${runtime(uptime)}
┃ 📁 RAM : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃
┣━━〔 📜 MAIN COMMANDS 〕━━⬣
┃ 💎 .menu
┃ 💎 .alive
┃ 💎 .ping
┃ 💎 .owner
┃
╰━━━━━━━━━━━━━━⬣
> POWERED BY SITHIJA-MD
`;

await conn.sendMessage(
from,
{
image: {
url: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/alive.png1.png?raw=true"
},
caption: aliveMsg
},
{ quoted: mek }
);

} catch (e) {
console.log(e);
reply(`${e}`);
}
});
