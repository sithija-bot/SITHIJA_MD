const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "pcgame",
    alias: ["game"],
    desc: "Search PC games",
    category: "PC Game",
    react: "🎮",
    filename: __filename
},
async(conn, mek, m, { q, reply }) => {

try {

if (!q) return reply("❌ Give a game name");

const url = `https://api.popcat.xyz/google?q=${q}+pc+game+download`;

const res = await axios.get(url);

const data = res.data;

if (!data) return reply("❌ No results found");

let txt = `🎮 *PC GAME SEARCH*\n\n`;
txt += `🔎 *Query:* ${q}\n\n`;
txt += `🌐 *Result:* ${data.url}\n`;

reply(txt);

} catch(e) {
console.log(e);
reply("❌ Error");
}

});
