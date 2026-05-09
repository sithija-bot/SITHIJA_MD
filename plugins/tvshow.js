const { cmd } = require("../command");
const axios = require("axios");

const API_KEY = "3a112bd9";

cmd({
  pattern: "tvseries",
  alias: ["series"],
  react: "📺",
  desc: "Search TV series info",
  category: "movie panel",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

  if (!q) {
    return reply(
`📺 TV SERIES SEARCH

Example:
.tvseries breaking bad`
    );
  }

  try {

    const res = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(q)}`
    );

    const data = res.data;

    if (data.Response === "False") {
      return reply("❌ TV Series not found");
    }

    let text = `╭━━〔 📺 TV SERIES INFO 〕━━⬣\n\n`;

    text += `┃ 🎬 Title : ${data.Title}\n`;
    text += `┃ 📅 Year : ${data.Year}\n`;
    text += `┃ ⭐ IMDb : ${data.imdbRating}\n`;
    text += `┃ 🎭 Genre : ${data.Genre}\n`;
    text += `┃ ⏱ Runtime : ${data.Runtime}\n`;
    text += `┃ 🌍 Country : ${data.Country}\n`;
    text += `┃ 🗣 Language : ${data.Language}\n`;
    text += `┃ 🎥 Director : ${data.Director}\n`;
    text += `┃ ✍ Writer : ${data.Writer}\n`;
    text += `┃ 👥 Actors : ${data.Actors}\n\n`;

    text += `┃ 📝 Plot :\n${data.Plot}\n\n`;

    text += `╰━━━━━━━━━━━━━━━━━━⬣`;

    await conn.sendMessage(from, {
      image: { url: data.Poster },
      caption: text
    }, { quoted: mek });

  } catch (e) {

    console.log(e);

    reply("❌ Error fetching TV series");

  }

});
