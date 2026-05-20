const { cmd, replyHandlers } = require('../command');
const axios = require('axios');

const API_KEY = 'lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6';

const SEARCH_BASE = 'https://nexora.laksidunimsara.com/cinesubz';
const DOWNLOAD_BASE = 'https://new77777.vercel.app/movie/cinesubz';

const movieReplies = {};
const qualityReplies = {};

/* =========================
   SEARCH COMMAND
========================= */

cmd({
    pattern: "cinesubz",
    alias: ["movie2", "cs"],
    react: "🎬",
    desc: "Search movies from Cinesubz",
    category: "movie",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply,
    sender
}) => {

    try {

        if (!q) {
            return reply(
`🎬 *Enter movie name*

Example:
.cs spider man`
            );
        }

        /* SEARCH API */

        const searchUrl =
`${SEARCH_BASE}/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const res = await axios.get(searchUrl);

        let results =
            res.data.result ||
            res.data.results ||
            res.data.data ||
            [];

        if (!Array.isArray(results)) {
            results = Object.values(results);
        }

        if (results.length === 0) {
            return reply("❌ No movies found");
        }

        movieReplies[sender] = results;

        /* MOVIE LIST */

        let txt =
`╭━━〔 *CINESUBZ SEARCH* 〕━━⬣

`;

        results.slice(0, 10).forEach((v, i) => {

            txt +=
`*${i + 1}.* ${v.title || v.name || "Unknown"}\n`;

        });

        txt += `\n📌 Reply with movie number`;

        txt += `\n╰━━━━━━━━━━━━━━⬣`;

        return reply(txt);

    } catch (e) {

        console.log("SEARCH ERROR:", e);

        return reply("❌ Search Error");
    }
});

/* =========================
   MOVIE SELECT
========================= */

replyHandlers.push({

    filter: (text, { sender }) => {

        return (
            movieReplies[sender] &&
            !isNaN(text)
        );

    },

    function: async (conn, mek, m, {
        from,
        body,
        sender,
        reply
    }) => {

        try {

            const index = Number(body) - 1;

            const movies = movieReplies[sender];

            if (!movies || !movies[index]) {
                return reply("❌ Invalid movie number");
            }

            const movie = movies[index];

            delete movieReplies[sender];

            const title =
                movie.title ||
                movie.name ||
                "Unknown";

            const movieUrl =
                movie.url ||
                movie.link;

            if (!movieUrl) {
                return reply("❌ Movie URL not found");
            }

            const image =
                movie.image ||
                movie.thumbnail ||
                movie.poster ||
                'https://files.catbox.moe/5xryn5.jpg';

            /* DOWNLOAD API */

            const dlUrl =
`${DOWNLOAD_BASE}?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

            const dlres = await axios.get(dlUrl);

            console.log(
                JSON.stringify(dlres.data, null, 2)
            );

            let qualities = [];

            if (Array.isArray(dlres.data)) {

                qualities = dlres.data;

            } else if (dlres.data.result) {

                qualities = dlres.data.result;

            } else if (dlres.data.data) {

                qualities = dlres.data.data;
            }

            if (
                !Array.isArray(qualities) ||
                qualities.length === 0
            ) {
                return reply("❌ No download links found");
            }

            /* SAVE QUALITIES */

            qualityReplies[sender] = {
                title,
                image,
                data: qualities
            };

            /* QUALITY MESSAGE */

            let txt =
`╭━━〔 *${title}* 〕━━⬣

📥 *AVAILABLE QUALITIES*

`;

            qualities.forEach((v, i) => {

                txt +=
`*${i + 1}.* ${v.quality || v.label || "Movie"}\n`;

            });

            txt += `\n📌 Reply with quality number`;

            txt += `\n╰━━━━━━━━━━━━━━⬣`;

            await conn.sendMessage(
                from,
                {
                    image: { url: image },
                    caption: txt
                },
                { quoted: mek }
            );

        } catch (e) {

            console.log("MOVIE SELECT ERROR:", e);

            return reply("❌ Movie Fetch Error");
        }
    }
});

/* =========================
   QUALITY SELECT
========================= */

replyHandlers.push({

    filter: (text, { sender }) => {

        return (
            qualityReplies[sender] &&
            !isNaN(text)
        );

    },

    function: async (conn, mek, m, {
        from,
        body,
        sender,
        reply
    }) => {

        try {

            const index = Number(body) - 1;

            const data = qualityReplies[sender];

            if (!data || !data.data[index]) {
                return reply("❌ Invalid quality number");
            }

            const selected = data.data[index];

            delete qualityReplies[sender];

            const videoUrl =
                selected.url ||
                selected.link ||
                selected.download;

            if (!videoUrl) {
                return reply("❌ Video link not found");
            }

            await reply("⬇️ Downloading movie...");

            /* SEND VIDEO DOCUMENT */

            await conn.sendMessage(
                from,
                {
                    document: {
                        url: videoUrl
                    },
                    mimetype: "video/mp4",
                    fileName:
`${data.title} - ${selected.quality || "Movie"}.mp4`,
                    caption:
`🎬 *${data.title}*

📥 Quality: ${selected.quality || "Unknown"}`
                },
                { quoted: mek }
            );

        } catch (e) {

            console.log("DOWNLOAD ERROR:", e);

            return reply("❌ Download Error");
        }
    }
});
