const { cmd } = require("../command");
const axios = require("axios");

const pendingSearch = {};
const pendingQuality = {};

const API_KEY =
  "lakiya_6dfa6b43064dd56b5c71acb12fc9b30e4d88dd0deb19c8b14f897d12fc87b8e6";

async function searchMovies(query) {
  try {
    const api = `https://nexora.laksidunimsara.com/yts/search?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}`;

    const res = await axios.get(api);

    if (!res.data || !Array.isArray(res.data.results)) return [];

    return res.data.results.slice(0, 10).map((m, i) => ({
      id: i + 1,
      title: m.title || "Unknown",
      year: m.year || "N/A",
      rating: m.rating || "N/A",
      url: m.url,
      image: m.image || m.thumbnail || "",
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
    desc: "Search and download movies from YTSMX",
    category: "movie",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q) {
        return reply(
          `*🎬 YTSMX MOVIE SEARCH*\n\n` +
            `📌 Example:\n` +
            `.movie avengers`
        );
      }

      await reply("*🔍 Searching movies...*");

      const results = await searchMovies(q);

      if (!results.length) {
        return reply("*❌ No movies found!*");
      }

      pendingSearch[sender] = {
        results,
        timestamp: Date.now(),
      };

      let text = `*🎬 YTSMX SEARCH RESULTS*\n\n`;

      results.forEach((movie, i) => {
        text +=
          `*${i + 1}.* ${movie.title}\n` +
          `📅 Year : ${movie.year}\n` +
          `⭐ Rating : ${movie.rating}\n\n`;
      });

      text += `*📩 Reply with movie number*\n`;

      await reply(text);
    } catch (e) {
      console.log(e);

      reply("*❌ Movie search failed!*");
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
      await conn.sendMessage(from, {
        react: {
          text: "🎥",
          key: mek.key,
        },
      });

      const index = parseInt(body.trim()) - 1;

      const selectedMovie = pendingSearch[sender].results[index];

      delete pendingSearch[sender];

      const details = await getMovieDetails(selectedMovie.url);

      if (!details) {
        return reply("*❌ Failed to fetch movie details!*");
      }

      const downloads =
        details.downloads ||
        details.links ||
        details.qualities ||
        [];

      if (!downloads.length) {
        return reply("*❌ No download links found!*");
      }

      pendingQuality[sender] = {
        movie: details,
        qualities: downloads,
        timestamp: Date.now(),
      };

      let caption =
        `*🎬 ${details.title || selectedMovie.title}*\n\n` +
        `⭐ Rating : ${details.rating || "N/A"}\n` +
        `📅 Year : ${details.year || "N/A"}\n` +
        `⏱ Runtime : ${details.runtime || "N/A"}\n` +
        `🎭 Genre : ${
          Array.isArray(details.genre)
            ? details.genre.join(", ")
            : details.genre || "N/A"
        }\n\n` +
        `📝 ${
          details.description ||
          details.desc ||
          "No description available."
        }\n\n` +
        `*📥 AVAILABLE QUALITIES*\n`;

      downloads.forEach((d, i) => {
        caption +=
          `\n*${i + 1}.* ${d.quality || "Unknown"}\n` +
          `💾 Size : ${d.size || "N/A"}\n`;
      });

      caption += `\n*📩 Reply with quality number*`;

      const image =
        details.image ||
        details.thumbnail ||
        selectedMovie.image;

      if (image) {
        await conn.sendMessage(
          from,
          {
            image: {
              url: image,
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

      reply("*❌ Error fetching movie details!*");
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
  async (conn, mek, m, { body, sender, reply, from }) => {
    try {
      await conn.sendMessage(from, {
        react: {
          text: "⬇️",
          key: mek.key,
        },
      });

      const index = parseInt(body.trim()) - 1;

      const data = pendingQuality[sender];

      delete pendingQuality[sender];

      const selected = data.qualities[index];

      const downloadUrl =
        selected.url ||
        selected.link ||
        selected.download ||
        selected.downloadLink ||
        selected.direct;

      if (!downloadUrl) {
        return reply("*❌ Download link not found!*");
      }

      await reply(
        `*⬇️ Sending ${selected.quality || "Movie"}...*\nPlease wait.`
      );

      await conn.sendMessage(
        from,
        {
          document: {
            url: downloadUrl,
          },
          mimetype: "video/mp4",

          fileName: `${(
            data.movie.title || "movie"
          ).substring(0, 50)} - ${
            selected.quality || "HD"
          }.mp4`.replace(/[^\w\s.-]/gi, ""),

          caption:
            `*🎬 ${data.movie.title || "Movie"}*\n` +
            `*📊 Quality:* ${
              selected.quality || "N/A"
            }\n` +
            `*💾 Size:* ${
              selected.size || "N/A"
            }\n\n` +
            `*🍿 Enjoy your movie!*`,
        },
        { quoted: mek }
      );
    } catch (error) {
      console.error("Send document error:", error);

      reply(
        `*❌ Failed to send movie!*\n${
          error.message || "Unknown error"
        }`
      );
    }
  }
);

setInterval(() => {
  const now = Date.now();

  const timeout = 10 * 60 * 1000;

  for (const s in pendingSearch) {
    if (now - pendingSearch[s].timestamp > timeout) {
      delete pendingSearch[s];
    }
  }

  for (const s in pendingQuality) {
    if (now - pendingQuality[s].timestamp > timeout) {
      delete pendingQuality[s];
    }
  }
}, 5 * 60 * 1000);

module.exports = {
  pendingSearch,
  pendingQuality,
};
