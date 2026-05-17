const { cmd, commands } = require("../command");

const pendingMenu = {};

const headerImage =
  "https://github.com/sithija-bot/SITHIJA_MD/blob/main/alive.png1.png?raw=true";

const numberEmoji = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];

cmd(
  {
    pattern: "menu",
    react: "📂",
    desc: "Show all command categories",
    category: "main",
    filename: __filename,
  },
  async (conn, mek, m, { from, sender }) => {
    try {
      const commandMap = {};

      for (const command of commands) {
        if (command.dontAddCommandList) continue;

        const category = (command.category || "misc").toUpperCase();

        if (!commandMap[category]) {
          commandMap[category] = [];
        }

        commandMap[category].push(command);
      }

      const categories = Object.keys(commandMap);

      let menuText = `
╭━━━〔 *SITHIJA-MD MENU* 〕━━━⬣
┃
┃ ✦ *Hello User 👋*
┃ ✦ *Select A Category Number*
┃
┣━━━━━━━━━━━━━━━⬣
`;

      categories.forEach((cat, index) => {
        menuText += `┃ ${numberEmoji[index] || "🔹"} ${cat} COMMANDS\n`;
      });

      menuText += `┣━━━━━━━━━━━━━━━⬣
┃ 🤖 *Bot Name:* SITHIJA-MD
┃ 📦 *Categories:* ${categories.length}
┃ ⚡ *Version:* 1.0.0
╰━━━━━━━━━━━━━━━⬣`;

      await conn.sendMessage(
        from,
        {
          image: { url: headerImage },
          caption: menuText,
        },
        { quoted: mek }
      );

      pendingMenu[sender] = {
        step: "category",
        commandMap,
        categories,
      };
    } catch (e) {
      console.log(e);
    }
  }
);

cmd(
  {
    on: "text",
  },
  async (conn, mek, m, { from, body, sender, reply }) => {
    try {
      if (!pendingMenu[sender]) return;

      if (pendingMenu[sender].step !== "category") return;

      if (!/^[1-9]|10$/.test(body.trim())) return;

      const data = pendingMenu[sender];

      const selected = parseInt(body.trim()) - 1;

      if (
        selected < 0 ||
        selected >= data.categories.length
      ) {
        return reply("❌ Invalid Number");
      }

      const category = data.categories[selected];
      const cmds = data.commandMap[category];

      let text = `
╭━━━〔 *${category} MENU* 〕━━━⬣
┃
`;

      cmds.forEach((cmd, i) => {
        const aliases = cmd.alias
          ? ` (${cmd.alias.join(", ")})`
          : "";

        text += `┃ ${i + 1}. .${cmd.pattern}${aliases}
┃ ✦ ${cmd.desc || "No Description"}
┃
`;
      });

      text += `┣━━━━━━━━━━━━━━━⬣
┃ 📦 *Total Commands:* ${cmds.length}
╰━━━━━━━━━━━━━━━⬣`;

      await conn.sendMessage(
        from,
        {
          image: { url: headerImage },
          caption: text,
        },
        { quoted: mek }
      );

      delete pendingMenu[sender];
    } catch (e) {
      console.log(e);
    }
  }
);
