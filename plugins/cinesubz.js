const { cmd, replyHandlers } = require('../command');
const axios = require('axios');

const API_KEY = 'lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6';
const BASE_URL = 'https://nexora.laksidunimsara.com/cinesubz';

const movieReplies = {};

cmd({
    pattern: "cinesubz",
    alias: ["movie", "cs"],
    react: "🎬",
    desc: "Search movies",
    category: "search",
    filename: __filename
},

async (conn, mek, m, { from, q, reply, sender }) => {

    try {

        if (!q) {
            return reply(
`🎬 Enter movie name

Example:
.cs spider man`
            );
        }

        // SEARCH API
        const searchUrl =
`${BASE_URL}/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const res = await axios.get(searchUrl);

        console.log("SEARCH:", res.data);

        const results =
            res.data.result ||
            res.data.results ||
            res.data.data ||
            [];

        if (!Array.isArray(results) || results.length === 0) {
            return reply("❌ No movies found");
        }

        // SAVE RESULTS
        movieReplies[sender] = results;

        // MOVIE LIST
        let txt = `🎬 *Search Results*\n\n`;

        results.slice(0, 10).forEach((v, i) => {

            txt += `*${i + 1}.* ${v.title || v.name || "Unknown"}\n`;

        });

        txt += `\n_Reply with movie number_`;

        return reply(txt);

    } catch (e) {

        console.log("SEARCH ERROR:", e);

        return reply(`❌ Search Error\n\n${e.message}`);

    }

});

/* =========================
   REPLY HANDLER
========================= */

replyHandlers.push({

    filter: (text, { sender }) => {

        return (
            movieReplies[sender] &&
            !isNaN(text)
        );

    },

    function: async (conn, mek, m, { from, body, sender, reply }) => {

        try {

            const index = Number(body) - 1;

            const movies = movieReplies[sender];

            if (!movies || !movies[index]) {
                return reply("❌ Invalid number");
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

            /* =========================
               DETAILS API
            ========================= */

            let details = {};

            try {

                const detailsUrl =
`${BASE_URL}/details?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

                const dres = await axios.get(detailsUrl);

                console.log("DETAILS:", dres.data);

                details =
                    dres.data.result ||
                    dres.data.data ||
                    dres.data ||
                    {};

            } catch (e) {

                console.log("DETAILS ERROR:", e.message);

            }

            /* =========================
               DOWNLOAD API
            ========================= */

            let downloads = [];

            try {

                const dlUrl =
`${BASE_URL}/dl?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

                const dlres = await axios.get(dlUrl);

                console.log("DOWNLOAD:", dlres.data);

                downloads =
                    dlres.data.result?.downloads ||
                    dlres.data.downloads ||
                    dlres.data.result ||
                    dlres.data.data ||
                    [];

                if (!Array.isArray(downloads)) {
                    downloads = [];
                }

            } catch (e) {

                console.log("DOWNLOAD ERROR:", e.message);

            }

            /* =========================
               CAPTION
            ========================= */

            let caption =
`╭━━〔 *CINESUBZ MOVIE* 〕━━⬣
┃🎬 *Title:* ${title}
`;

            if (details.year)
                caption += `┃📆 *Year:* ${details.year}\n`;

            if (details.imdb)
                caption += `┃⭐ *IMDb:* ${details.imdb}\n`;

            if (details.genre)
                caption += `┃🎭 *Genre:* ${details.genre}\n`;

            if (details.country)
                caption += `┃🌍 *Country:* ${details.country}\n`;

            caption += `╰━━━━━━━━━━━━━━⬣\n\n`;

            /* =========================
               DOWNLOAD LINKS
            ========================= */

            if (downloads.length > 0) {

                caption += `📥 *DOWNLOAD LINKS*\n\n`;

                downloads.slice(0, 10).forEach((d, i) => {

                    const quality =
                        d.quality ||
                        d.type ||
                        "Movie";

                    const link =
                        d.link ||
                        d.url ||
                        d.download ||
                        d.dl_link;

                    caption += `*${i + 1}.* ${quality}\n`;

                    if (link) {
                        caption += `🔗 ${link}\n\n`;
                    }

                });

            } else {

                caption += `❌ No download links found`;

            }

            /* =========================
               SEND MESSAGE
            ========================= */

            await conn.sendMessage(
                from,
                {
                    image: { url: image },
                    caption: caption
                },
                { quoted: mek }
            );

        } catch (e) {

            console.log("MOVIE ERROR:", e);

            return reply(
`❌ Movie Fetch Error

${e.message}`
            );

        }

    }

});
