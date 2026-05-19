const { cmd } = require("../command");
const fetch = require("node-fetch");

const API_KEY = "lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6";

const movieStore = {};

cmd({
    pattern: "yts",
    alias: ["movie"],
    react: "🎬",
    desc: "Search movies",
    category: "movie",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {

    try {

        if (!q) return reply("❌ Movie name ekak denna");

        const searchUrl =
        `https://nexora.laksidunimsara.com/yts/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const res = await fetch(searchUrl);
        const json = await res.json();

        console.log(json);

        const movies = json.results || json.data || json.movies;

        if (!movies || movies.length === 0) {
            return reply("❌ Movie hoyaganna bari una");
        }

        const movie = movies[0];

        const detailsUrl =
        `https://nexora.laksidunimsara.com/yts/movie-details?url=${encodeURIComponent(movie.url)}&api_key=${API_KEY}`;

        const dres = await fetch(detailsUrl);
        const djson = await dres.json();

        console.log(djson);

        const data = djson.movie || djson.data || djson;

        if (!data.downloads || data.downloads.length === 0) {
            return reply("❌ Download links naha");
        }

        movieStore[sender] = data.downloads;

        let text = `🎬 *${data.title}*\n\n`;
        text += `⭐ Rating : ${data.rating || "N/A"}\n`;
        text += `📅 Year : ${data.year || "N/A"}\n\n`;

        text += `⬇️ *REPLY NUMBER TO DOWNLOAD*\n\n`;

        data.downloads.forEach((dl, i) => {
            text += `*${i + 1}.* ${dl.quality}\n`;
            text += `📦 ${dl.size}\n\n`;
        });

        await conn.sendMessage(from, {
            image: {
                url: data.image || movie.image
            },
            caption: text
        }, { quoted: mek });

    } catch (e) {
        console.log("ERROR =>", e);
        reply("❌ API Error");
    }

});

cmd({
    on: "text"
},
async (conn, mek, m, { from, body, sender }) => {

    try {

        if (!movieStore[sender]) return;

        const num = parseInt(body);

        if (isNaN(num)) return;

        const downloads = movieStore[sender];

        if (!downloads[num - 1]) return;

        const selected = downloads[num - 1];

        await conn.sendMessage(from, {
            text:
`🎥 *${selected.quality} DOWNLOAD*

📦 Size : ${selected.size}

🔗 ${selected.url}`
        }, { quoted: mek });

        delete movieStore[sender];

    } catch (e) {
        console.log(e);
    }

});
