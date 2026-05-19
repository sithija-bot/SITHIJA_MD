const { cmd } = require("../command");
const fetch = require("node-fetch");

const API_KEY = "lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6";

cmd({
    pattern: "yts",
    alias: ["movie"],
    react: "🎬",
    desc: "Search YTS Movies",
    category: "movie",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("❌ Movie name ekak denna");

        // SEARCH API
        const searchUrl =
        `https://nexora.laksidunimsara.com/yts/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const res = await fetch(searchUrl);
        const json = await res.json();

        console.log(json);

        // FIX RESULTS
        const movies = json.results || json.data || json.movies;

        if (!movies || movies.length === 0) {
            return reply("❌ Movie hoyaganna bari una");
        }

        const movie = movies[0];

        // DETAILS API
        const detailsUrl =
        `https://nexora.laksidunimsara.com/yts/movie-details?url=${encodeURIComponent(movie.url)}&api_key=${API_KEY}`;

        const dres = await fetch(detailsUrl);
        const djson = await dres.json();

        console.log(djson);

        const data = djson.movie || djson.data || djson;

        let text = `🎬 *${data.title || "Unknown"}*\n\n`;
        text += `⭐ Rating : ${data.rating || "N/A"}\n`;
        text += `📅 Year : ${data.year || "N/A"}\n`;
        text += `🎭 Genre : ${data.genre || "N/A"}\n\n`;

        if (data.downloads && data.downloads.length > 0) {

            text += `⬇️ *DOWNLOAD LINKS*\n\n`;

            data.downloads.forEach((dl, i) => {
                text += `*${i + 1}.* ${dl.quality || "Quality"}\n`;
                text += `📦 ${dl.size || "Unknown"}\n`;
                text += `🔗 ${dl.url}\n\n`;
            });

        } else {
            text += "❌ Download links naha";
        }

        await conn.sendMessage(from, {
            image: {
                url: data.image || movie.image
            },
            caption: text
        }, { quoted: mek });

    } catch (e) {

        console.log("YTS ERROR :", e);

        reply("❌ API Error\n\nCheck console logs");

    }

});
