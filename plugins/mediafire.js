const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "mediafire",
    alias: ["mf"],
    desc: "Download MediaFire files",
    category: "download",
    react: "📥",
    filename: __filename
},
async(conn, mek, m, { q, reply }) => {

try {

if (!q) return reply("❌ Please provide a MediaFire link");

const api = `https://api.vihangayt.com/downloader/mediafire?url=${q}`;

const res = await axios.get(api);

const data = res.data.data;

if (!data) return reply("❌ File not found");

await conn.sendMessage(mek.chat, {
    document: { url: data.link },
    mimetype: data.mime,
    fileName: data.name,
    caption: `📥 MediaFire Download\n\n📄 Name: ${data.name}\n📦 Size: ${data.size}`
}, { quoted: mek });

} catch (e) {
console.log(e);
reply("❌ Error downloading file");
}

});
