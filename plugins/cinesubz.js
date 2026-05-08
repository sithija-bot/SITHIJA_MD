const axios = require("axios");

module.exports = {
    name: "cinesubz",
    alias: ["cine", "cinetv"],
    desc: "CineSubz Movie & TV Series Search",
    category: "movie",

    async execute(sock, m, args) {

        const text = args.join(" ");

        if (!text) {
            return m.reply(
`🎬 MOVIE
.cine spiderman

📺 TV SERIES
.cinetv stranger things`
            );
        }

        try {

            // =========================
            // MOVIE COMMAND
            // =========================
            if (m.body.startsWith(".cine")) {

                // SEARCH MOVIE
                const search = await axios.get(
                    `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?query=${encodeURIComponent(text)}`
                );

                const results =
                    search.data.result ||
                    search.data.results ||
                    search.data.data ||
                    [];

                if (!Array.isArray(results) || !results.length) {
                    return m.reply("❌ Movie Not Found");
                }

                const movie = results[0];

                const movieUrl =
                    movie.link ||
                    movie.url ||
                    movie.href ||
                    "";

                if (!movieUrl)
                    return m.reply("❌ Invalid Movie URL");

                // MOVIE INFO
                const info = await axios.get(
                    `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(movieUrl)}`
                );

                const data =
                    info.data.result ||
                    info.data.data ||
                    info.data;

                // DOWNLOAD LINKS
                const dl = await axios.get(
                    `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(movieUrl)}`
                );

                const downloads =
                    dl.data.downloads ||
                    dl.data.links ||
                    dl.data.result ||
                    dl.data.data ||
                    [];

                let dlinks = "";

                if (Array.isArray(downloads) && downloads.length) {

                    downloads.forEach((v, i) => {

                        if (typeof v === "string") {

                            dlinks += `⬇️ Download ${i + 1}\n${v}\n\n`;

                        } else {

                            dlinks += `🎥 Quality : ${v.quality || "Default"}\n`;
                            dlinks += `📦 Size : ${v.size || "Unknown"}\n`;
                            dlinks += `🔗 ${v.url || v.link || "No Link"}\n\n`;

                        }

                    });

                } else {

                    dlinks = "❌ No Download Links Found";

                }

                const caption = `
╭━━〔 🎬 SITHIJA-MD MOVIE 〕━━⬣
┃
┃ 🎥 Title : ${data.title || movie.title || "N/A"}
┃ ⭐ IMDB : ${data.imdb || "N/A"}
┃ 📅 Year : ${data.year || "N/A"}
┃ 🌍 Country : ${data.country || "N/A"}
┃ 🎭 Genre : ${data.genre || "N/A"}
┃ ⏱️ Runtime : ${data.runtime || "N/A"}
┃
╰━━━━━━━━━━━━━━⬣

📥 DOWNLOAD LINKS

${dlinks}
`;

                const image =
                    data.image ||
                    data.poster ||
                    movie.image ||
                    movie.poster ||
                    null;

                if (image) {

                    return await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: image },
                            caption: caption
                        },
                        { quoted: m }
                    );

                }

                return m.reply(caption);

            }

            // =========================
            // TV SERIES COMMAND
            // =========================
            if (m.body.startsWith(".cinetv")) {

                // SEARCH TV SERIES
                const search = await axios.get(
                    `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?query=${encodeURIComponent(text)}`
                );

                const results =
                    search.data.result ||
                    search.data.results ||
                    search.data.data ||
                    [];

                if (!Array.isArray(results) || !results.length) {
                    return m.reply("❌ TV Series Not Found");
                }

                const tv = results[0];

                const tvUrl =
                    tv.link ||
                    tv.url ||
                    tv.href ||
                    "";

                if (!tvUrl)
                    return m.reply("❌ Invalid TV Series URL");

                // TV INFO
                const info = await axios.get(
                    `https://api-dark-shan-yt.koyeb.app/tv/cinesubz-info?url=${encodeURIComponent(tvUrl)}`
                );

                const data =
                    info.data.result ||
                    info.data.data ||
                    info.data;

                const episodes =
                    data.episodes ||
                    data.result ||
                    [];

                let epText = "";

                if (Array.isArray(episodes) && episodes.length) {

                    episodes.slice(0, 20).forEach((v, i) => {

                        if (typeof v === "string") {

                            epText += `🎬 ${i + 1}. ${v}\n`;

                        } else {

                            epText += `🎬 ${i + 1}. ${v.title || v.name || "Episode"}\n`;

                        }

                    });

                } else {

                    epText = "❌ No Episodes Found";

                }

                const caption = `
╭━━〔 📺 SITHIJA-MD TV SERIES 〕━━⬣
┃
┃ 🎥 Title : ${data.title || tv.title || "N/A"}
┃ ⭐ IMDB : ${data.imdb || "N/A"}
┃ 📅 Year : ${data.year || "N/A"}
┃ 🎭 Genre : ${data.genre || "N/A"}
┃ 📀 Seasons : ${data.seasons || "N/A"}
┃
╰━━━━━━━━━━━━━━⬣

📺 EPISODES

${epText}
`;

                const image =
                    data.image ||
                    data.poster ||
                    tv.image ||
                    tv.poster ||
                    null;

                if (image) {

                    return await sock.sendMessage(
                        m.chat,
                        {
                            image: { url: image },
                            caption: caption
                        },
                        { quoted: m }
                    );

                }

                return m.reply(caption);

            }

        } catch (err) {

            console.log(err);

            return m.reply(
`❌ Error Fetching Data

Possible Reasons:
• API Down
• Invalid Movie / TV Name
• Server Error
• API Response Changed`
            );

        }
    }
};
