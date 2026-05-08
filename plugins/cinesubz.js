const axios = require("axios");
const { cmd } = require("../command");

const API_KEY = "564727fa";

cmd(
  {
    pattern: "movie",
    alias: ["film"],
    desc: "Movie Search",
    category: "movie",
    react: "🎬",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {

      if (!q)
        return reply("❌ Movie name ekak denna");

      // SEARCH MOVIE
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(q)}`
      );

      const movie = res.data;

      if (movie.Response === "False") {
        return reply("❌ Movie not found");
      }

      let msg = `
🎬 *${movie.Title}*

📅 Year : ${movie.Year}
⭐ Rating : ${movie.imdbRating}
🎭 Genre : ${movie.Genre}
🌍 Country : ${movie.Country}
🗣️ Language : ${movie.Language}
⏱️ Runtime : ${movie.Runtime}
🎞️ Type : ${movie.Type}

👨‍🎤 Actors :
${movie.Actors}

📝 Plot :
${movie.Plot}

🔗 IMDB :
https://www.imdb.com/title/${movie.imdbID}
`;

      await conn.sendMessage(
        from,
        {
          image: {
            url: movie.Poster
          },
          caption: msg,
        },
        { quoted: mek }
      );

    } catch (e) {

      console.log(e);

      reply(
        "❌ Error Fetching Movie\n\n" +
        e.message
      );
    }
  }
);
