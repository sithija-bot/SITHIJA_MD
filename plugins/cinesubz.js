const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");
const { cmd } = require("../command");

cmd(
  {
    pattern: "movie",
    alias: ["cinesubz"],
    desc: "Search movies from CineSubz",
    category: "movie",
    react: "🎬",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {

      if (!q) {
        return reply("❌ Movie name ekak denna");
      }

      // SEARCH
      const searchUrl =
        `https://cinesubz.co/?s=${encodeURIComponent(q)}`;

      const body = await cloudscraper.get(searchUrl);

      const $ = cheerio.load(body);

      let movieLink = null;
      let title = null;
      let image = null;

      $("article").each((i, el) => {

        const link = $(el)
          .find("a")
          .attr("href");

        const text = $(el)
          .find("h2")
          .text()
          .trim();

        const img = $(el)
          .find("img")
          .attr("src");

        if (link && !movieLink) {
          movieLink = link;
          title = text;
          image = img;
        }

      });

      if (!movieLink) {
        return reply("❌ Movie not found");
      }

      // MOVIE PAGE
      const movieBody =
        await cloudscraper.get(movieLink);

      const $$ = cheerio.load(movieBody);

      // DESCRIPTION
      const description =
        $$("meta[name='description']")
          .attr("content") ||
        "No description";

      // DOWNLOAD LINKS
      let links = "";

      $$("a").each((i, el) => {

        const href = $$(el).attr("href");
        const text = $$(el).text().trim();

        if (
          href &&
          (
            text.includes("720") ||
            text.includes("1080") ||
            text.includes("480") ||
            text.toLowerCase().includes("download")
          )
        ) {

          links += `\n🔗 ${text}\n${href}\n`;

        }

      });

      if (!links) {
        links = "\n❌ Download links not found";
      }

      // FINAL MESSAGE
      const msg = `
🎬 *${title}*

📝 ${description}

📥 *Download Links*
${links}
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

    } catch (e) {

      console.log(e);

      reply(
        `❌ Error Fetching Movie\n\n${e.message}`
      );
    }
  }
);
