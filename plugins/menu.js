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
        text: menuText,
        footer: "Powered By Sithija",
        buttons: [
          {
            buttonId: ".downloadmenu",
            buttonText: { displayText: "📥 DOWNLOAD" },
            type: 1
          },
          {
            buttonId: ".groupmenu",
            buttonText: { displayText: "👥 GROUP" },
            type: 1
          },
          {
            buttonId: ".ownermenu",
            buttonText: { displayText: "👑 OWNER" },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: mek });

    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
