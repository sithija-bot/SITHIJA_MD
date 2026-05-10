const { cmd, commands } = require("../command");

const pendingMenu = {};

const numberEmojis = [
  "0️⃣","1️⃣","2️⃣","3️⃣","4️⃣",
  "5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"
];

// CATEGORY IMAGES
const menuImages = {
  MAIN: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.33.16.jpeg?raw=true",
  DOWNLOAD: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.31.20.jpeg?raw=true",
  GROUP: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.57.jpeg?raw=true",
  OWNER: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.32.49.jpeg?raw=true",
  MOVIE: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.11.jpeg?raw=true",
  AI: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.35.23.jpeg?raw=true",
  SEARCH: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.36.00.jpeg?raw=true",
};

const defaultImage =
  "https://raw.githubusercontent.com/sithija-bot/SITHIJA_MD/main/images/ChatGPT%20Image%20May%208,%202026,%2006_22_57%20PM.png";

// MAIN MENU
cmd(
  {
    pattern: "menu",
    react: "🏠",
    alias: ["allmenu", "panel", "commands"],
    desc: "Show all command categories",
    category: "main",
    filename: __filename,
  },
  async (test, m, msg, { from, sender, pushname, reply }) => {

    try {

      await test.sendMessage(from, {
        react: {
          text: "🏠",
          key: m.key,
        },
      });

      const commandMap = {};

      for (const command of commands) {

        if (command.dontAddCommandList) continue;
        if (!command.category) continue;
        if (command.category.toLowerCase() === "misc") continue;

        const category = command.category.toUpperCase();

        if (!commandMap[category]) {
          commandMap[category] = [];
        }

        commandMap[category].push(command);
      }

      const categories = Object.keys(commandMap);

      let menuText = `
╭━━〔 ⚡ SITHIJA MD ⚡ 〕━━⬣
┃ 👤 USER : ${pushname}
┃ 🚀 STATUS : ONLINE
┃ ⚡ SPEED : ${Math.floor(Math.random() * 100)}ms
┃ 💻 VERSION : 1.0.0
┃ 📦 COMMANDS : ${commands.length}
╰━━━━━━━━━━━━━━⬣

╭━━〔 COMMAND LIST 〕━━⬣
`;

      categories.forEach((cat, i) => {

        const emoji =
          (i + 1)
            .toString()
            .split("")
            .map((n) => numberEmojis[n])
            .join("");

        menuText += `┃ ${emoji} ${cat}\n┃\n`;
      });

      menuText += `╰━━━━━━━━━━━━━━⬣`;

      await test.sendMessage(
        from,
        {
          image: {
            url: menuImages["MAIN"] || defaultImage,
          },
          caption: menuText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "SITHIJA MD",
              body: "MULTI DEVICE WHATSAPP BOT",
              thumbnailUrl: menuImages["MAIN"] || defaultImage,
              sourceUrl: "https://github.com/",
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: false,
            },
          },
        },
        {
          quoted: m,
        }
      );

      pendingMenu[sender] = {
        step: "category",
        commandMap,
        categories,
      };

    } catch (e) {
      console.log(e);
      reply(`❌ Error : ${e}`);
    }
  }
);

// CATEGORY MENU
cmd(
  {
    filter: (text, { sender }) =>
      pendingMenu[sender] &&
      pendingMenu[sender].step === "category" &&
      /^[1-9][0-9]*$/.test(text.trim()),
  },
  async (test, m, msg, { from, body, sender, reply }) => {

    try {

      await test.sendMessage(from, {
        react: {
          text: "⚡",
          key: m.key,
        },
      });

      const { commandMap, categories } = pendingMenu[sender];

      const index = parseInt(body.trim()) - 1;

      if (index < 0 || index >= categories.length) {
        return reply("❌ INVALID NUMBER");
      }

      const selectedCategory = categories[index];

      const cmdsInCategory = commandMap[selectedCategory];

      let cmdText = `
╭━━〔 📂 ${selectedCategory} MENU 〕━━⬣

`;

      cmdsInCategory.forEach((c, i) => {

        const patterns = [
          c.pattern,
          ...(c.alias || []),
        ]
          .filter(Boolean)
          .map((p) => `.${p}`);

        cmdText += `┃ ${numberEmojis[i + 1] || "🔹"} ${patterns.join(" , ")}\n`;
        cmdText += `┃ 📄 ${c.desc || "NO DESCRIPTION"}\n`;
        cmdText += `┣━━━━━━━━━━━━⬣\n`;
      });

      cmdText += `
╰━━〔 ${cmdsInCategory.length} COMMANDS 〕━━⬣
`;

      await test.sendMessage(
        from,
        {
          image: {
            url: menuImages[selectedCategory] || defaultImage,
          },
          caption: cmdText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: `${selectedCategory} MENU`,
              body: "SITHIJA MD WHATSAPP BOT",
              thumbnailUrl: menuImages[selectedCategory] || defaultImage,
              sourceUrl: "https://github.com/",
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: false,
            },
          },
        },
        {
          quoted: m,
        }
      );

      delete pendingMenu[sender];

    } catch (e) {
      console.log(e);
      reply(`❌ Error : ${e}`);
    }
  }
);
