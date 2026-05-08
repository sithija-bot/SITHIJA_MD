```js
const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    alias: ["allmenu", "panel"],
    desc: "Show bot command menu",
    category: "main",
    react: "📜",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      pushname,
      reply,
    }
  ) => {
    try {

      let menu = `
╭━━〔 *SITHIJA MD* 〕━━⬣
┃👤 User : ${pushname}
┃⚡ Prefix : .
┃🤖 Mode : Public
┃📦 Commands : ${Object.keys(commands).length}
╰━━━━━━━━━━━━━━⬣

`;

      const categories = {};

      // GROUP COMMANDS
      for (let command in commands) {

        const cmdData = commands[command];

        if (!cmdData.pattern) continue;

        const category =
          cmdData.category || "misc";

        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(
          cmdData.pattern
        );
      }

      // CREATE MENU
      for (let cat in categories) {

        menu += `╭━━〔 *${cat.toUpperCase()}* 〕━━⬣\n`;

        for (let cmdName of categories[cat]) {
          menu += `┃➤ .${cmdName}\n`;
        }

        menu += `╰━━━━━━━━━━━━━━⬣\n\n`;
      }

      menu += `> © Powered By Sithija MD`;

      // SEND MENU
      await conn.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/ChatGPT%20Image%20May%208,%202026,%2006_22_57%20PM.png?raw=true"
          },
          caption: menu,
        },
        { quoted: mek }
      );

    } catch (e) {

      console.log(e);

      reply("❌ Error loading menu");

    }
  }
);
```
