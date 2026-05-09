const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "fitgirl",
    alias: ["fg"],
    desc: "Search FitGirl repacks",
    category: "search",
    react: "🎮",
    filename: __filename
},
async(conn, mek, m, { q, reply }) => {

try {

if (!q) return reply("❌ Please give a game name");

const search = encodeURIComponent(q);

const api = `https://api.popcat.xyz/google?q=site:fitgirl-repacks.site+${search}`;

const res = await axios.get(api);

const data = res.data;

if (!data || !data.url) {
    return reply("❌ No results found");
}

let txt = `🎮 *FITGIRL SEARCH*\n\n`;
txt += `🕹️ *Game:* ${q}\n\n`;
txt += `🔗 *Link:* ${data.url}\n`;

reply(txt);

} catch (e) {
console.log(e);
reply("❌ Error searching game");
}

});
