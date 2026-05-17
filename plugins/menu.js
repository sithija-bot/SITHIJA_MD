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
      let menu = `
╭━━━〔 *SITHIJA-MD* 〕━━━⬣
┃
┃ 👤 *User :* ${pushname}
┃ ⏰ *Time :* ${new Date().toLocaleTimeString()}
┃ 📅 *Date :* ${new Date().toLocaleDateString()}
┃ 🤖 *Mode :* Public
┃
╰━━━━━━━━━━━━━━⬣

╭━━〔 *MAIN COMMANDS* 〕━━⬣
┃➤ .menu
┃➤ .alive
┃➤ .ping
┃➤ .system
┃➤ .runtime
╰━━━━━━━━━━━━━━⬣

╭━━〔 *DOWNLOAD COMMANDS* 〕━━⬣
┃➤ .song
┃➤ .video
┃➤ .ytmp3
┃➤ .ytmp4
┃➤ .tiktok
┃➤ .facebook
┃➤ .mediafire
╰━━━━━━━━━━━━━━⬣

╭━━〔 *GROUP COMMANDS* 〕━━⬣
┃➤ .tagall
┃➤ .hidetag
┃➤ .kick
┃➤ .add
┃➤ .promote
┃➤ .demote
┃➤ .mute
┃➤ .unmute
╰━━━━━━━━━━━━━━⬣

╭━━〔 *OWNER COMMANDS* 〕━━⬣
┃➤ .restart
┃➤ .shutdown
┃➤ .block
┃➤ .unblock
┃➤ .setpp
┃➤ .setname
╰━━━━━━━━━━━━━━⬣

╭━━〔 *FUN COMMANDS* 〕━━⬣
┃➤ .joke
┃➤ .quote
┃➤ .fact
┃➤ .truth
┃➤ .dare
╰━━━━━━━━━━━━━━⬣

> © Powered By SITHIJA-MD
`;

      await conn.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/ChatGPT%20Image%20May%2016,%202026,%2009_18_56%20PM.png?raw=true",
          },
          caption: menu,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "SITHIJA-MD WHATSAPP BOT",
              body: "Fast & Powerful Multi Device Bot",
              thumbnailUrl:
                "https://github.com/sithija-bot/SITHIJA_MD/blob/main/ChatGPT%20Image%20May%2016,%202026,%2009_18_56%20PM.png?raw=true",
              sourceUrl: "https://github.com/",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`Error: ${e}`);
    }
  }
);
