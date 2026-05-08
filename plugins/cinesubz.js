const axios = require("axios");
const { cmd } = require("../command");

cmd(
  {
    pattern: "cine",
    desc: "Search Movies From CineSubz",
    category: "movie",
    filename: __filename,
  },
  async (
    sithija,
    mek,
    m,
    {
      from,
      q,
      reply
    }
  ) => {

    try {

      if (!q)
        return reply(
`🎬 Example:
.cine spiderman`
        );

      // SEARCH
      const search = await axios.get(
        `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?query=${encodeURIComponent(q)}`
      );

      const results =
        search.data.result ||
        search.data.results ||
        search.data.data ||
        [];

      if (!results.length)
        return reply("❌ Movie Not Found");

      const movie = results[0];

      const movieUrl =
        movie.link ||
        movie.url ||
        movie.href;

      // INFO
      const info = await axios.get(
        `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(movieUrl)}`
      );

      const data =
        info.data.result ||
        info.data.data ||
        info.data;

      // DOWNLOAD
      const dl = await axios.get(
        `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(movieUrl)}`
      );

      const downloads =
        dl.data.downloads ||
        dl.data.links ||
        dl.data.result ||
        [];

      let links = "";

      if (Array.isArray(downloads)) {

        downloads.forEach((v, i) => {

          if (typeof v === "string") {

            links += `🔗 ${i + 1}. ${v}\n\n`;

          } else {

            links += `🎥 ${v.quality || "Quality"}\n`;
            links += `📦 ${v.size || "Unknown"}\n`;
            links += `🔗 ${v.url || v.link}\n\n`;

          }

        });

      }

      const caption = `
╭━━〔 🎬 SITHIJA-MD MOVIE 〕━━⬣
┃ 🎥 ${data.title || movie.title}
┃ ⭐ ${data.imdb || "N/A"}
┃ 📅 ${data.year || "N/A"}
┃ 🎭 ${data.genre || "N/A"}
╰━━━━━━━━━━━━━━⬣

📥 DOWNLOAD LINKS

${links || "No Links Found"}
`;

      const image =
        data.image ||
        data.poster ||
        movie.image ||
        movie.poster;

      if (image) {

        return await sithija.sendMessage(
          from,
          {
            image: { url: image },
            caption
          },
          { quoted: mek }
        );

      }

      return reply(caption);

    } catch (e) {

      console.log(e);

      return reply("❌ Error Fetching Movie");

    }
  }
);

// =======================================
// TV SERIES
// =======================================

cmd(
  {
    pattern: "cinetv",
    desc: "Search TV Series From CineSubz",
    category: "tv",
    filename: __filename,
  },
  async (
    sithija,
    mek,
    m,
    {
      from,
      q,
      reply
    }
  ) => {

    try {

      if (!q)
        return reply(
`📺 Example:
.cinetv stranger things`
        );

      // SEARCH
      const search = await axios.get(
        `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?query=${encodeURIComponent(q)}`
      );

      const results =
        search.data.result ||
        search.data.results ||
        search.data.data ||
        [];

      if (!results.length)
        return reply("❌ TV Series Not Found");

      const tv = results[0];

      const tvUrl =
        tv.link ||
        tv.url ||
        tv.href;

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
        [];

      let epText = "";

      if (Array.isArray(episodes)) {

        episodes.slice(0, 20).forEach((v, i) => {

          epText += `🎬 ${i + 1}. ${v.title || v.name || v}\n`;

        });

      }

      const caption = `
╭━━〔 📺 SITHIJA-MD TV SERIES 〕━━⬣
┃ 🎥 ${data.title || tv.title}
┃ ⭐ ${data.imdb || "N/A"}
┃ 📅 ${data.year || "N/A"}
┃ 📀 ${data.seasons || "N/A"} Seasons
╰━━━━━━━━━━━━━━⬣

${epText || "No Episodes Found"}
`;

      const image =
        data.image ||
        data.poster ||
        tv.image ||
        tv.poster;

      if (image) {

        return await sithija.sendMessage(
          from,
          {
            image: { url: image },
            caption
          },
          { quoted: mek }
        );

      }

      return reply(caption);

    } catch (e) {

      console.log(e);

      return reply("❌ Error Fetching TV Series");

    }
  }
);
