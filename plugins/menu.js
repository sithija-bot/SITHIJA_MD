const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Dynamic Command Menu",
    category: "main",
    react: "📜",
    filename: __filename,
  },
  async (conn, mek, m, { from, pushname, reply }) => {
    try {

      // AUTO CATEGORY CREATE
      let categories = {};

      for (let command of commands) {
        if (!command.category) continue;

        if (!categories[command.category]) {
          categories[command.category] = [];
        }

        categories[command.category].push(command.pattern);
      }

      // MAIN MENU
      let menuText = `
╭━━━〔 *SITHIJA-MD* 〕━━━⬣
┃ 👤 User : ${pushname}
┃ ⚡ Status : Online
┃ 📦 Plugins : ${commands.length}
╰━━━━━━━━━━━━━━⬣

╭━━〔 *MENU LIST* 〕━━⬣
`;

      let categoryNames = Object.keys(categories);

      categoryNames.forEach((cat, index) => {
        menuText += `┃➤ ${index + 1}. ${cat.toUpperCase()} MENU\n`;
      });

      menuText += `╰━━━━━━━━━━━━━━⬣\n\n`;
      menuText += `> Reply Number Below 👇\n`;

      categoryNames.forEach((cat, index) => {
        menuText += `> ${index + 1}️⃣ ${cat.toUpperCase()} MENU\n`;
      });

      // SEND MENU
      const sentMsg = await conn.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/7mcy8w.jpg",
          },
          caption: menuText,
        },
        { quoted: mek }
      );

      // REPLY DETECT
      conn.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text;

        const replyId =
          msg.message?.extendedTextMessage?.contextInfo?.stanzaId;

        // CHECK REPLY
        if (
          msg.key.remoteJid === from &&
          replyId === sentMsg.key.id
        ) {

          let number = parseInt(text);

          if (
            !isNaN(number) &&
            number > 0 &&
            number <= categoryNames.length
          ) {

            let category = categoryNames[number - 1];
            let cmds = categories[category];

            let replyText = `
╭━━〔 *${category.toUpperCase()} MENU* 〕━━⬣
`;

            cmds.forEach((cmdName) => {
              replyText += `┃➤ .${cmdName}\n`;
            });

            replyText += `╰━━━━━━━━━━━━━━⬣`;

            await conn.sendMessage(
              from,
              {
                text: replyText,
              },
              { quoted: msg }
            );
          }
        }
      });

    } catch (e) {
      console.log(e);
      reply(`Error: ${e}`);
    }
  }
);
