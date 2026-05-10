const { cmd, commands } = require("../command");

const pendingMenu = {};

const numberEmojis = [
  "0️⃣","1️⃣","2️⃣","3️⃣","4️⃣",
  "5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"
];

const headerImage =
  "https://raw.githubusercontent.com/sithija-bot/SITHIJA_MD/main/images/ChatGPT%20Image%20May%208,%202026,%2006_22_57%20PM.png";

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

        const category = command.category.toUpperCase();

        if (!commandMap[category]) {
          commandMap[category] = [];
        }

        commandMap[category].push(command);
      }

      const categories = Object.keys(commandMap);

      let menuText = `
╭──────────────────◆
│  ⚡ *SITHIJA MD*
│  👤 ${pushname}
│  🚀 ONLINE MODE
│  📦 ${commands.length} COMMANDS
│  💻 VERSION 1.0.0
╰──────────────────◆

╭━━〔 *COMMAND LIST* 〕━━◆
`;

      categories.forEach((cat, i) => {

        const emoji =
          (i + 1)
            .toString()
            .split("")
            .map((n) => numberEmojis[n])
            .join("");

        menuText += `┃ ${emoji} │ ${cat}\n`;
        menuText += `┃     ╰➤ ${commandMap[cat].length} COMMANDS\n`;
      });

      menuText += `╰━━━━━━━━━━━━━━━━◆

╭──────────────────◆
│ 💜 THE ULTIMATE BOT
│ ⚡ FAST • SIMPLE • POWERFUL
│ 👑 POWERED BY SITHIJA MD
╰──────────────────◆
`;

      await test.sendMessage(
        from,
        {
          image: {
            url: headerImage,
          },
          caption: menuText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "SITHIJA MD",
              body: "MULTI DEVICE WHATSAPP BOT",
              thumbnailUrl: headerImage,
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
╭──────────────────◆
│ 📂 ${selectedCategory} MENU
╰──────────────────◆

`;

      cmdsInCategory.forEach((c, i) => {

        const patterns = [
          c.pattern,
          ...(c.alias || []),
        ]
          .filter(Boolean)
          .map((p) => `.${p}`);

        cmdText += `╭━〔 ${numberEmojis[i + 1] || "🔹"} 〕━◆\n`;
        cmdText += `┃ ⚡ ${patterns.join(" , ")}\n`;
        cmdText += `┃ 📄 ${c.desc || "NO DESCRIPTION"}\n`;
        cmdText += `╰━━━━━━━━━━◆\n\n`;
      });

      cmdText += `
╭──────────────────◆
│ ✨ TOTAL : ${cmdsInCategory.length}
│ 💜 SITHIJA MD
╰──────────────────◆
`;

      await test.sendMessage(
        from,
        {
          image: {
            url: headerImage,
          },
          caption: cmdText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: `${selectedCategory} MENU`,
              body: "SITHIJA MD WHATSAPP BOT",
              thumbnailUrl: headerImage,
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
