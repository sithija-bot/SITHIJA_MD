const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Show all commands",
    category: "main",
    react: "📜",
    filename: __filename,
  },
  async (conn, mek, m, { from, pushname, reply }) => {
    try {

      const menu = `
╭━━━〔 *SITHIJA-MD* 〕━━━⬣
┃ 👤 User : ${pushname}
┃ ♦ Version : 1.0
┃ ⚡ Status : Online
╰━━━━━━━━━━━━━━⬣

╭━━〔 *MENU LIST* 〕━━⬣
┃➤ Main Menu
┃➤ Download Menu
┃➤ Group Menu
┃➤ Owner Menu
┃➤ Fun Menu
╰━━━━━━━━━━━━━━⬣

> Reply Number Below 👇
> 1️⃣ Main Menu
> 2️⃣ Download Menu
> 3️⃣ Group Menu
> 4️⃣ Owner Menu
> 5️⃣ Fun Menu
`;

      const sentMsg = await conn.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/7mcy8w.jpg",
          },
          caption: menu,
        },
        { quoted: mek }
      );

      conn.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];

        if (!msg.message) return;

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text;

        if (
          msg.key.remoteJid === from &&
          msg.message?.extendedTextMessage?.contextInfo?.stanzaId ===
            sentMsg.key.id
        ) {

          let replyText = "";

          if (text === "1") {
            replyText = `
╭━━〔 *MAIN MENU* 〕━━⬣
┃➤ .menu
┃➤ .alive
┃➤ .ping
┃➤ .runtime
┃➤ .system
╰━━━━━━━━━━━━━━⬣
`;
          }

          else if (text === "2") {
            replyText = `
╭━━〔 *DOWNLOAD MENU* 〕━━⬣
┃➤ .song
┃➤ .video
┃➤ .ytmp3
┃➤ .ytmp4
┃➤ .tiktok
┃➤ .facebook
╰━━━━━━━━━━━━━━⬣
`;
          }

          else if (text === "3") {
            replyText = `
╭━━〔 *GROUP MENU* 〕━━⬣
┃➤ .tagall
┃➤ .hidetag
┃➤ .kick
┃➤ .add
┃➤ .promote
┃➤ .demote
╰━━━━━━━━━━━━━━⬣
`;
          }

          else if (text === "4") {
            replyText = `
╭━━〔 *OWNER MENU* 〕━━⬣
┃➤ .restart
┃➤ .shutdown
┃➤ .block
┃➤ .unblock
┃➤ .setpp
╰━━━━━━━━━━━━━━⬣
`;
          }

          else if (text === "5") {
            replyText = `
╭━━〔 *FUN MENU* 〕━━⬣
┃➤ .joke
┃➤ .quote
┃➤ .fact
┃➤ .truth
┃➤ .dare
╰━━━━━━━━━━━━━━⬣
`;
          }

          if (replyText !== "") {
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
