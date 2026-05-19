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

        // SEARCH
        const searchUrl =
`${BASE_URL}/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const res = await axios.get(searchUrl);

        const results =
            res.data.result ||
            res.data.results ||
            res.data.data ||
            [];

        if (!results.length) {
            return reply("❌ No movies found");
        }

        // SAVE RESULTS
        movieReplies[sender] = results;

        // MOVIE LIST
        let txt = `🎬 *Search Results*\n\n`;

        results.slice(0, 10).forEach((v, i) => {

            txt += `*${i + 1}.* ${v.title || v.name}\n`;

        });

        txt += `\n_Reply with movie number_`;

        return reply(txt);

    } catch (e) {

        console.log(e);

        reply("❌ Search Error");

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

            if (!movies[index]) {
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

            const image =
                movie.image ||
                movie.thumbnail ||
                movie.poster ||
                'https://files.catbox.moe/5xryn5.jpg';

            // DETAILS
            const detailsUrl =
`${BASE_URL}/details?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

            let details = {};

            try {

                const dres = await axios.get(detailsUrl);

                details =
                    dres.data.result ||
                    dres.data.data ||
                    dres.data ||
                    {};

            } catch {}

            // DOWNLOAD
            const dlUrl =
`${BASE_URL}/dl?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

            let downloads = [];

            try {

                const dlres = await axios.get(dlUrl);

                downloads =
                    dlres.data.result ||
                    dlres.data.data ||
                    [];

            } catch {}

            // CAPTION
            let caption =
`╭━━〔 *CINESUBZ MOVIE* 〕━━⬣
┃🎬 Title : ${title}
`;

            if (details.year)
                caption += `┃📆 Year : ${details.year}\n`;

            if (details.imdb)
                caption += `┃⭐ IMDb : ${details.imdb}\n`;

            if (details.genre)
                caption += `┃🎭 Genre : ${details.genre}\n`;

            caption += `╰━━━━━━━━━━━━━━⬣\n\n`;

            // LINKS
            if (downloads.length > 0) {

                caption += `📥 DOWNLOAD LINKS\n\n`;

                downloads.slice(0, 5).forEach((d, i) => {

                    caption += `*${i + 1}.* ${d.quality || 'Movie'}\n`;

                    if (d.link) {
                        caption += `🔗 ${d.link}\n\n`;
                    }

                });

            } else {

                caption += `❌ No download links found`;

            }

            // SEND
            await conn.sendMessage(
                from,
                {
                    image: { url: image },
                    caption
                },
                { quoted: mek }
            );

        } catch (e) {

            console.log(e);

            reply("❌ Movie fetch error");

        }

    }

});
