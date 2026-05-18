const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");

cmd(
{
    pattern: "menu",
    desc: "Show All Commands",
    category: "main",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, {
    from,
    pushname,
    reply
}) => {

try {

const uptime = process.uptime();
const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

let menu = `
╔═══════〔 🌸 SITHIJA-MD 🌸 〕═══════╗

        👋 HELLO ${pushname}

✦ Welcome To The Anime World Of SITHIJA-MD ✦

╭───────────────❍
│ 🎮 BOT : SITHIJA-MD
│ 👤 USER : ${pushname}
│ 📞 OWNER : ${config.OWNER_NUMBER}
│ ⏰ UPTIME : ${runtime(uptime)}
│ 📂 RAM : ${ram} MB
│ 📊 COMMANDS : ${Object.keys(commands).length}
│ 🪄 PREFIX : ${config.PREFIX}
╰───────────────❍

🌸 Reply The Number Below 🌸

╭───────────────❍
│ ✧･ﾟ: *1》OWNER MENU*
│ ✧･ﾟ: *2》DOWNLOAD MENU*
│ ✧･ﾟ: *3》GROUP MENU*
│ ✧･ﾟ: *4》SEARCH MENU*
│ ✧･ﾟ: *5》FUN MENU*
│ ✧･ﾟ: *6》AI MENU*
│ ✧･ﾟ: *7》CONVERT MENU*
│ ✧･ﾟ: *8》GAME MENU*
│ ✧･ﾟ: *9》LOGO MENU*
│ ✧･ﾟ: *10》MAIN MENU*
│ ✧･ﾟ: *11》MOVIE MENU*
│ ✧･ﾟ: *12》OTHER MENU*
│ ✧･ﾟ: *13》EDUCATION MENU*
│ ✧･ﾟ: *14》ANIME MENU*
╰───────────────❍

> ⚡ POWERED BY SITHIJA-MD
`;

await conn.sendMessage(from, {
    image: { url: config.MENU_IMAGE },
    caption: menu
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
