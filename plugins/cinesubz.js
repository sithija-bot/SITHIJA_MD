const axios = require("axios");
const { cmd } = require("../command");

cmd(
  {
    pattern: "movie",
    alias: ["film", "cinema"],
    desc: "Search movies from Cinesubz",
    category: "movie",
    react: "🎬",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) {
        return reply("❌ Please give a movie name");
      }

      // SEARCH MOVIE
      const searchApi = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?text=${encodeURIComponent(q)}`;

      const search = await axios.get(searchApi, {
        headers: {
          Accept: "application/json",
        },
        timeout: 15000,
      });

      // CHECK SEARCH DATA
      if (!search.data) {
        return reply("❌ No response from API");
      }

      console.log("SEARCH DATA :", search.data);

      // GET RESULT ARRAY
      let results =
        search.data.result ||
        search.data.results ||
        search.data.data ||
        [];

      if (!Array.isArray(results) || results.length === 0) {
        return reply("❌ Movie not found");
      }

      // FIRST RESULT
      const first = results[0];

      const movieUrl =
        first.url ||
        first.link ||
        first.movie_url;

      if (!movieUrl) {
        return reply("❌ Movie URL not found");
      }

      // INFO API
      const infoApi = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(movieUrl)}`;

      const info = await axios.get(infoApi, {
        headers: {
          Accept: "application/json",
        },
        timeout: 15000,
      });

      if (!info.data) {
        return reply("❌ Failed to fetch movie info");
      }

      console.log("INFO DATA :", info.data);

      // MOVIE OBJECT
      const movie =
        info.data.result ||
        info.data.data ||
        info.data;

      // SAFE VALUES
      const title =
        movie.title ||
        movie.name ||
        "Unknown Movie";

      const year =
        movie.year ||
        "N/A";

      const rating =
        movie.rating ||
        "N/A";

      const genre =
        movie.genre ||
        movie.genres ||
        "N/A";

      const language =
        movie.language ||
        "N/A";

      const runtime =
        movie.runtime ||
        movie.duration ||
        "N/A";

      const description =
        movie.description ||
        movie.plot ||
        "No description available";

      const image =
        movie.image ||
        movie.poster ||
        "https://i.ibb.co/2kRZ6qR/no-image.jpg";

      // DOWNLOADS
      let downloadText = "";

      const downloads =
        movie.downloads ||
        movie.download ||
        [];

      if (Array.isArray(downloads) && downloads.length > 0) {
        downloadText += "\n📥 *Download Links*\n";

        downloads.forEach((d, i) => {
          const quality =
            d.quality ||
            d.name ||
            `Link ${i + 1}`;

          const link =
            d.link ||
            d.url ||
            "No link";

          downloadText += `\n${i + 1}. ${quality}\n${link}\n`;
        });
      }

      // FINAL MESSAGE
      const msg = `
🎬 *${title}*

⭐ Rating : ${rating}
📅 Year : ${year}
🎭 Genre : ${genre}
🗣️ Language : ${language}
⏱️ Runtime : ${runtime}

📝 Description :
${description}

${downloadText}
`;

      // SEND MESSAGE
      await conn.sendMessage(
        from,
        {
          image: { url: image },
          caption: msg,
        },
        { quoted: mek }
      );

    } catch (err) {
      console.log("MOVIE ERROR :", err);

      return reply(
        "❌ Error Fetching Movie\n\n" +
          err.message
      );
    }
  }
);
