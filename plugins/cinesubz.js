const { cmd } = require('../command');
const axios = require('axios');

const API_KEY = 'lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6';
const BASE_URL = 'https://nexora.laksidunimsara.com/cinesubz';

cmd({
    pattern: "cinesubz",
    alias: ["movie", "cs"],
    react: "🎬",
    desc: "Search movies from Cinesubz",
    category: "search",
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {

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

        console.log("SEARCH URL:", searchUrl);

        const searchRes = await axios.get(searchUrl);

        console.log("SEARCH DATA:", searchRes.data);

        const results =
            searchRes.data.result ||
            searchRes.data.results ||
            searchRes.data.data ||
            [];

        if (!Array.isArray(results) || results.length === 0) {
            return reply("❌ No movie found");
        }

        const movie = results[0];

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

        if (!movieUrl) {
            return reply("❌ Movie URL not found");
        }

        // DETAILS
        const detailsUrl =
`${BASE_URL}/details?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

        console.log("DETAILS URL:", detailsUrl);

        let details = {};

        try {

            const detailsRes = await axios.get(detailsUrl);

            console.log("DETAILS DATA:", detailsRes.data);

            details =
                detailsRes.data.result ||
                detailsRes.data.data ||
                detailsRes.data ||
                {};

        } catch (e) {
            console.log("DETAILS ERROR:", e.message);
        }

        // DOWNLOADS
        const dlUrl =
`${BASE_URL}/dl?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

        console.log("DL URL:", dlUrl);

        let downloads = [];

        try {

            const dlRes = await axios.get(dlUrl);

            console.log("DL DATA:", dlRes.data);

            downloads =
                dlRes.data.result ||
                dlRes.data.data ||
                [];

        } catch (e) {
            console.log("DL ERROR:", e.message);
        }

        // MESSAGE
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
                    caption += `${d.link}\n\n`;
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
                caption: caption
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log("FULL ERROR:", e);

        reply(
`❌ Error while fetching movie

${e.message}`
        );

    }

});
