const axios = require("axios");
const { cmd } = require("../command");

cmd(
  {
    pattern: "cine",
    desc: "Search movies from Cinesubz",
    category: "movie panel",
    react: "🎬",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please give a movie name");

      // SEARCH API
      const search = await axios.get(
        `http://apis.laksidunimsara.com/cinesubz/search?q=${encodeURIComponent(q)}`
      );

      const data = search.data;

      if (!data || !data.result || data.result.length === 0) {
        return reply("❌ Movie not found");
      }

      let text = `🎬 *CINESUBZ MOVIE SEARCH*\n\n`;
      let movieList = [];

      for (let i = 0; i < Math.min(data.result.length, 10); i++) {
        const movie = data.result[i];

        movieList.push(movie);

        text += `*${i + 1}.* ${movie.title}\n`;
        text += `🔗 ID: ${movie.id}\n\n`;
      }

      text += `\n📌 Reply with movie number`;

      const sentMsg = await conn.sendMessage(
        from,
        { text: text },
        { quoted: mek }
      );

      // Reply Listener
      conn.ev.on("messages.upsert", async ({ messages }) => {
        try {
          const msg = messages[0];

          if (!msg.message) return;

          const messageText =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

          if (!messageText) return;

          if (
            msg.message.extendedTextMessage &&
            msg.message.extendedTextMessage.contextInfo?.stanzaId ===
              sentMsg.key.id
          ) {
            const num = parseInt(messageText);

            if (isNaN(num)) return;

            if (num < 1 || num > movieList.length) {
              return reply("❌ Invalid number");
            }

            const selectedMovie = movieList[num - 1];

            // DETAILS API
            const details = await axios.get(
              `http://apis.laksidunimsara.com/cinesubz/details?id=${selectedMovie.id}`
            );

            const info = details.data.result || details.data;

            let caption = `🎥 *${info.title || selectedMovie.title}*\n\n`;

            if (info.year) caption += `📅 Year: ${info.year}\n`;
            if (info.country) caption += `🌍 Country: ${info.country}\n`;
            if (info.runtime) caption += `⏰ Runtime: ${info.runtime}\n`;
            if (info.imdb) caption += `⭐ IMDB: ${info.imdb}\n`;

            if (info.description) {
              caption += `\n📝 Description:\n${info.description}\n`;
            }

            // Download Links
            if (info.downloads && info.downloads.length > 0) {
              caption += `\n📥 *DOWNLOAD LINKS*\n\n`;

              info.downloads.forEach((dl, index) => {
                caption += `*${index + 1}.* ${dl.quality || "Quality"}\n`;
                caption += `${dl.link}\n\n`;
              });
            }

            // Send Poster
            if (info.image) {
              await conn.sendMessage(
                from,
                {
                  image: { url: info.image },
                  caption: caption,
                },
                { quoted: mek }
              );
            } else {
              await reply(caption);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.log(e);
      reply("❌ Error fetching movie");
    }
  }
);
