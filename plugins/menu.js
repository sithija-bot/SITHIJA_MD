const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (
    danuwa,
    mek,
    m,
    {
      from,
      pushname,
      reply
    }
  ) => {
    try {

      const menuText = `
╭━━〔 🤖 SITHIJA MD 🤖 〕━━⬣
┃ 👋 Hello ${pushname}
┃ ⚡ Bot Status : Online
╰━━━━━━━━━━━━━━⬣

📌 Select Menu Category Below
`;

    await danuwa.sendMessage(from, {
    image: { url: "https://files.catbox.moe/8tqwa6.jpg" },
    caption: menuText,
    footer: "Powered By Sithija",
    templateButtons: [
        {
            index: 1,
            quickReplyButton: {
                displayText: "📥 DOWNLOAD",
                id: ".downloadmenu"
            }
        },
        {
            index: 2,
            quickReplyButton: {
                displayText: "👥 GROUP",
                id: ".groupmenu"
            }
        },
        {
            index: 3,
            quickReplyButton: {
                displayText: "👑 OWNER",
                id: ".owner"
            }
        }
    ]
}, { quoted: mek });
      
    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
