const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");

cmd(
  {
    pattern: "movie",
    alias: ["cinesubz", "cinetv"],
    desc: "CineSubz Movie Search",
    category: "movie",
    react: "🎬",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {

      if (!q) {
        return reply("❌ Movie name ekak denna");
      }

      // SEARCH PAGE
      const searchUrl = `https://cinesubz.co/?s=${encodeURIComponent(q)}`;

      const searchRes = await axios.get(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const $ = cheerio.load(searchRes.data);

      // FIRST RESULT
      const first = $("article").first();

      const title =
        first.find("h2").text().trim() ||
        "Unknown";

      const link =
        first.find("a").attr("href");

      const image =
        first.find("img").attr("src");

      if (!link) {
        return reply("❌ Movie not found");
      }

      // MOVIE PAGE
      const movieRes = await axios.get(link, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const $$ = cheerio.load(movieRes.data);

      // DESCRIPTION
      const description =
        $$("meta[name='description']").attr("content") ||
        "No description";

      // DOWNLOAD LINKS
      let downloads = "";

      $$("a").each((i, el) => {

        const href = $$(el).attr("href");
        const text = $$(el).text();

        if (
          href &&
          (
            text.includes("Download") ||
            text.includes("1080") ||
            text.includes("720") ||
            text.includes("480")
          )
        ) {

          downloads += `\n🔗 ${text}\n${href}\n`;
        }

      });

      if (!downloads) {
        downloads = "\n❌ Download links not found";
      }

      // FINAL MSG
      const msg = `
🎬 *${title}*

📝 ${description}

📥 *Download Links*
${downloads}
`;

      // SEND
      await conn.sendMessage(
        from,
        {
          image: { url: image },
          caption: msg,
        },
        { quoted: mek }
      );

    } catch (err) {

      console.log(err);

      reply(
        `❌ Error Fetching Movie\n\n${err.message}`
      );
    }
  }
);
