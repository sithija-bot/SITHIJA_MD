const { cmd } = require("../command");
const axios = require("axios");

const API_KEY = "lakiya_a1ec33dbf54f21e8416a648c3737c7f43e9abf6e0d9c5a008970ce7872f60915";

cmd({
    pattern: "cine",
    alias: ["cinesubz", "film"],
    react: "🎬",
    desc: "Search and download movies",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {
    from,
    q,
    reply
}) => {

    try {

        if (!q) {
            return reply("*🎬 Movie name eka denna*");
        }

        // SEARCH API
        const search = await axios.get(
            `https://apis.laksidunimsara.com/cinesubz/search?query=${encodeURIComponent(q)}&api_key=${API_KEY}`
        );

        const results = search.data;

        if (!results || results.length < 1) {
            return reply("❌ Movie hoyaganna ba");
        }

        const movie = results[0];

        // DETAILS API
        const details = await axios.get(
            `https://apis.laksidunimsara.com/cinesubz/details?id=${movie.id}&api_key=${API_KEY}`
        );

        const data = details.data;

        let caption = `
🎬 *${data.title || movie.title}*

📅 Year : ${data.year || "N/A"}
⭐ Rating : ${data.rating || "N/A"}
🌍 Country : ${data.country || "N/A"}
🎭 Genre : ${data.genre || "N/A"}

📝 Description :
${data.description || "No description"}

🔗 Download Links :
`;

        if (data.downloads && data.downloads.length > 0) {

            data.downloads.forEach((dl, i) => {
                caption += `\n${i + 1}. ${dl.quality || "Quality"}\n${dl.link}\n`;
            });

        } else {
            caption += "\nNo download links found";
        }

        // SEND IMAGE + CAPTION
        await conn.sendMessage(from, {
            image: {
                url: data.image || movie.image
            },
            caption: caption
        }, {
            quoted: mek
        });

    } catch (e) {
        console.log(e);

        reply("❌ Error fetching movie");
    }

});
