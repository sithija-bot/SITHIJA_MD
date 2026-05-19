const { cmd } = require("../command");
const axios = require("axios");

const pendingSearch = {};
const pendingQuality = {};

const API_KEY =
  "lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6";

async function searchMovies(query) {
  try {
    const url = `https://nexora.laksidunimsara.com/yts/search?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}`;

    const res = await axios.get(url);

    if (!res.data || !Array.isArray(res.data.results)) return [];

    return res.data.results.slice(0, 10).map((m, i) => ({
      id: i + 1,
      title: m.title || "Unknown",
      year: m.year || "N/A",
      rating: m.rating || "N/A",
      url: m.url,
      image: m.image,
    }));
  } catch (e) {
    console.log("Search Error:", e.message);
    return [];
  }
}

async function getMovieDetails(movieUrl) {
  try {
    const api = `https://nexora.laksidunimsara.com/yts/movie-details?url=${encodeURIComponent(
      movieUrl
    )}&api_key=${API_KEY}`;

    const res = await axios.get(api);

    return res.data;
  } catch (e) {
    console.log("Details Error:", e.message);
    return null;
  }
}

cmd(
  {
    pattern: "movie2",
    alias: ["yts", "ytsmx", "cinema"],
    react: "🎬",
    desc: "Search movies from YTSMX",
    category: "movie",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q)
        return reply(
          "*🎬 YTS Movie Search*\n\nExample:\n.movie avengers"
        );

      await reply("*🔍 Searching movies...*");

      const results = await searchMovies(q);

      if (!results.length) {
        return reply("*❌ No movies found!*");
      }

      pendingSearch[sender] = {
        results,
        timestamp: Date.now(),
      };

      let text = `*🎬 YTS Search Results*\n\n`;

      results.forEach((m, i) => {
        text += `*${i + 1}.* ${m.title}\n`;
        text += `📅 Year : ${m.year}\n`;
        text += `⭐ Rating : ${m.rating}\n\n`;
      });

      text += `*Reply with movie number*\n`;

      await reply(text);
    } catch (e) {
      console.log(e);
      reply("*❌ Error searching movie!*");
    }
  }
);

cmd(
  {
    filter: (text, { sender }) =>
      pendingSearch[sender] &&
      !isNaN(text) &&
      parseInt(text) > 0 &&
      parseInt(text) <= pendingSearch[sender].results.length,
  },
  async (conn, mek, m, { body, sender, from, reply }) => {
    try {
      const index = parseInt(body) - 1;

      const movie = pendingSearch[sender].results[index];

      delete pendingSearch[sender];

      await conn.sendMessage(from, {
        react: { text: "🎥", key: mek.key },
      });

      const details = await getMovieDetails(movie.url);

      if (!details) {
        return reply("*❌ Failed to fetch movie details!*");
      }

      let caption = `*🎬 ${details.title || movie.title}*\n\n`;

      caption += `⭐ Rating : ${details.rating || "N/A"}\n`;
      caption += `📅 Year : ${details.year || "N/A"}\n`;
      caption += `⏱ Runtime : ${details.runtime || "N/A"}\n`;
      caption += `🎭 Genre : ${
        details.genre?.join(", ") || "N/A"
      }\n\n`;

      caption += `📝 ${details.description || "No description"}\n\n`;

      caption += `*📥 Available Qualities*\n`;

      const qualities = details.downloads || [];

      if (!qualities.length) {
        return reply("*❌ No download links found!*");
      }

      qualities.forEach((q, i) => {
        caption += `\n*${i + 1}.* ${q.quality}`;
        caption += `\n💾 Size : ${q.size}`;
      });

      caption += `\n\n*Reply with quality number*`;

      pendingQuality[sender] = {
        movie: details,
        qualities,
      };

      if (details.image || movie.image) {
        await conn.sendMessage(
          from,
          {
            image: {
              url: details.image || movie.image,
            },
            caption,
          },
          { quoted: mek }
        );
      } else {
        await reply(caption);
      }
    } catch (e) {
      console.log(e);
      reply("*❌ Error fetching details!*");
    }
  }
);

cmd(
  {
    filter: (text, { sender }) =>
      pendingQuality[sender] &&
      !isNaN(text) &&
      parseInt(text) > 0 &&
      parseInt(text) <= pendingQuality[sender].qualities.length,
  },
  async (conn, mek, m, { body, sender, from, reply }) => {
    try {
      const index = parseInt(body) - 1;

      const data = pendingQuality[sender];

      delete pendingQuality[sender];

      const selected = data.qualities[index];

      await conn.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      let txt = `*🎬 ${data.movie.title}*\n\n`;

      txt += `📥 Quality : ${selected.quality}\n`;
      txt += `💾 Size : ${selected.size}\n\n`;

      txt += `🔗 Download Link:\n${selected.url || selected.link}\n\n`;

      txt += `🍿 Enjoy Your Movie`;

      await reply(txt);
    } catch (e) {
      console.log(e);
      reply("*❌ Failed to send download link!*");
    }
  }
);

setInterval(() => {
  const now = Date.now();
  const timeout = 10 * 60 * 1000;

  for (const x in pendingSearch) {
    if (now - pendingSearch[x].timestamp > timeout) {
      delete pendingSearch[x];
    }
  }

  for (const x in pendingQuality) {
    if (now - pendingQuality[x].timestamp > timeout) {
      delete pendingQuality[x];
    }
  }
}, 5 * 60 * 1000);

module.exports = {
  pendingSearch,
  pendingQuality,
};
