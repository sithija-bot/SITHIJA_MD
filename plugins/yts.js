const { cmd } = require("../command");
const fetch = require("node-fetch");

const API_KEY = "lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6";

cmd({
    pattern: "ytsmx",
    alias: ["yts", "film"],
    react: "🎬",
    desc: "Search and download movies",
    category: "movie",
    use: ".movie avatar"
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {

    try {

        if (!q) {
            return reply("❌ Movie name ekak denna");
        }

        // SEARCH MOVIE
        const searchUrl = `https://nexora.laksidunimsara.com/yts/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.results || searchData.results.length === 0) {
            return reply("❌ Movie hoyaganna bari una");
        }

        const movie = searchData.results[0];

        // GET MOVIE DETAILS
        const detailsUrl = `https://nexora.laksidunimsara.com/yts/movie-details?url=${encodeURIComponent(movie.url)}&api_key=${API_KEY}`;

        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        if (!detailsData.movie) {
            return reply("❌ Movie details ganna bari una");
        }

        const data = detailsData.movie;

        let caption = `╭━━━〔 🎬 YTS MOVIE 〕━━━⬣\n`;
        caption += `┃\n`;
        caption += `┃ 🎥 Title : ${data.title}\n`;
        caption += `┃ ⭐ Rating : ${data.rating || "N/A"}\n`;
        caption += `┃ 📅 Year : ${data.year || "N/A"}\n`;
        caption += `┃ 🎭 Genre : ${data.genre || "N/A"}\n`;
        caption += `┃ ⏱ Runtime : ${data.runtime || "N/A"}\n`;
        caption += `┃\n`;
        caption += `╰━━━━━━━━━━━━━━⬣\n\n`;

        caption += `📖 *Description*\n`;
        caption += `${data.description || "No description"}\n\n`;

        if (data.downloads && data.downloads.length > 0) {

            caption += `⬇️ *DOWNLOAD LINKS*\n\n`;

            data.downloads.forEach((dl, i) => {
                caption += `*${i + 1}.* ${dl.quality}\n`;
                caption += `📦 Size : ${dl.size}\n`;
                caption += `🔗 ${dl.url}\n\n`;
            });

        } else {
            caption += "❌ Download links naha";
        }

        await conn.sendMessage(from, {
            image: { url: data.image },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error occured");
    }

});
