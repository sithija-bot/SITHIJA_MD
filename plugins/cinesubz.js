const { cmd } = require('../command');
const axios = require('axios');

const API_KEY = 'lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6';
const BASE_URL = 'https://nexora.laksidunimsara.com/cinesubz';

cmd({
    pattern: "cinesubz",
    alias: ["movie", "cs"],
    react: "🎬",
    desc: "Search movies from Cinesubz API",
    category: "movie",
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) {
            return reply(
`🎬 Please give a movie name.

Example:
.cinesubz spider man`
            );
        }

        // SEARCH API
        const searchUrl =
`${BASE_URL}/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`;

        const searchRes = await axios.get(searchUrl);

        const results =
            searchRes.data.result ||
            searchRes.data.results ||
            searchRes.data.data ||
            [];

        if (!results.length) {
            return reply("❌ No movies found.");
        }

        // FIRST RESULT
        const first = results[0];

        const title =
            first.title ||
            first.name ||
            "Unknown";

        const movieUrl =
            first.url ||
            first.link;

        const image =
            first.image ||
            first.thumbnail ||
            first.poster ||
            'https://files.catbox.moe/5xryn5.jpg';

        // DETAILS API
        const detailsUrl =
`${BASE_URL}/details?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

        const detailsRes = await axios.get(detailsUrl);

        const details =
            detailsRes.data.result ||
            detailsRes.data.data ||
            detailsRes.data ||
            {};

        // DOWNLOAD API
        const dlUrl =
`${BASE_URL}/dl?url=${encodeURIComponent(movieUrl)}&api_key=${API_KEY}`;

        const dlRes = await axios.get(dlUrl);

        const downloads =
            dlRes.data.result ||
            dlRes.data.data ||
            [];

        // CAPTION
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

        if (details.runtime)
            caption += `┃⏰ *Runtime:* ${details.runtime}\n`;

        caption += `╰━━━━━━━━━━━━━━⬣\n\n`;

        // DOWNLOAD LINKS
        if (downloads.length > 0) {

            caption += `📥 *DOWNLOAD LINKS*\n\n`;

            downloads.slice(0, 10).forEach((d, i) => {

                caption += `*${i + 1}.* ${d.quality || 'Movie'}\n`;

                if (d.link) {
                    caption += `🔗 ${d.link}\n\n`;
                }

            });

        } else {

            caption += `❌ No download links found.`;

        }

        // SEND MESSAGE
        await conn.sendMessage(
            from,
            {
                image: { url: image },
                caption: caption
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply("❌ Error while fetching movie.");

    }

});
