const { cmd, commands } = require("../command");

const pendingMenu = {};

const numberEmojis = [
  "0ï¸âƒ£","1ï¸âƒ£","2ï¸âƒ£","3ï¸âƒ£","4ï¸âƒ£",
  "5ï¸âƒ£","6ï¸âƒ£","7ï¸âƒ£","8ï¸âƒ£","9ï¸âƒ£","ðŸ”Ÿ"
];

// CATEGORY IMAGES
const menuImages = {
  DOWNLOAD: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.31.20.jpeg?raw=true",
  GROUP: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.57.jpeg?raw=true",
  OWNER: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.32.49.jpeg?raw=true",
  MOVIE: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.11.jpeg?raw=true",
  AI: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.35.23.jpeg?raw=true",
  SEARCH: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.36.00.jpeg?raw=true",
};

const defaultImage =
  "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/ChatGPT%20Image%20May%2010,%202026,%2007_16_34%20PM.png?raw=true";

// MAIN MENU
cmd(
  {
    pattern: "menu",
    react: "ðŸ ",
    alias: ["allmenu", "panel", "commands"],
    desc: "Show all command categories",
    category: "main",
    filename: __filename,
  },
  async (test, m, msg, { from, sender, pushname, reply }) => {

    try {

      await test.sendMessage(from, {
        react: {
          text: "ðŸ ",
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
â•­â”â”ã€” âš¡ SITHIJA MD âš¡ ã€•â”â”â¬£
â”ƒ ðŸ‘¤ USER : ${pushname}
â”ƒ ðŸš€ STATUS : ONLINE
â”ƒ âš¡ SPEED : ${Math.floor(Math.random() * 100)}ms
â”ƒ ðŸ’» VERSION : 1.0.0
â”ƒ ðŸ“¦ COMMANDS : ${commands.length}
â•°â”â”â”â”â”â”â”â”â”â”â”â”â”â”â¬£

â•­â”â”ã€” COMMAND LIST ã€•â”â”â¬£
`;

      categories.forEach((cat, i) => {

        const emoji =
          (i + 1)
            .toString()
            .split("")
            .map((n) => numberEmojis[n])
            .join("");

        // GAP REMOVE
        menuText += `â”ƒ ${emoji} ${cat}\n`;
      });

      menuText += `â•°â”â”â”â”â”â”â”â”â”â”â”â”â”â”â¬£`;

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
      reply(`âŒ Error : ${e}`);
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
          text: "âš¡",
          key: m.key,
        },
      });

      const { commandMap, categories } = pendingMenu[sender];

      const index = parseInt(body.trim()) - 1;

      if (index < 0 || index >= categories.length) {
        return reply("âŒ INVALID NUMBER");
      }

      const selectedCategory = categories[index];

      const cmdsInCategory = commandMap[selectedCategory];

      let cmdText = `
â•­â”â”ã€” ðŸ“‚ ${selectedCategory} MENU ã€•â”â”â¬£
`;

      cmdsInCategory.forEach((c, i) => {

        const patterns = [
          c.pattern,
          ...(c.alias || []),
        ]
          .filter(Boolean)
          .map((p) => `.${p}`);

        cmdText += `
â”ƒ ${numberEmojis[i + 1] || "ðŸ”¹"} ${patterns.join(" , ")}
â”ƒ ðŸ“„ ${c.desc || "NO DESCRIPTION"}
â”£â”â”â”â”â”â”â”â”â”â”â”â”â¬£`;
      });

      cmdText += `

â•°â”â”ã€” ${cmdsInCategory.length} COMMANDS ã€•â”â”â¬£
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
      reply(`âŒ Error : ${e}`);
    }
  }
);
