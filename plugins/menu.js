```js id="0o4skd"
const { cmd } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Show menu",
    category: "main",
    react: "📜",
    filename: __filename,
  },
  async (conn, mek, m, { from, pushname, reply }) => {

    try {

      const menu = `
╭━━━〔 SITHIJA MD 〕━━━⬣
┃ User : ${pushname}
┃ Prefix : .
╰━━━━━━━━━━━━━━⬣

➤ .menu
➤ .alive
➤ .ping

> Powered By Sithija MD
`;

      await conn.sendMessage(
        from,
        {
          text: menu,
        },
        { quoted: mek }
      );

    } catch (e) {

      console.log(e);

      reply("Error");

    }

  }
);
```
