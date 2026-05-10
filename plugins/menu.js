// MAIN MENU
cmd(
  {
    pattern: "menu",
    react: "🏠", // මෙතන reaction එක තියෙන නිසා අමුතුවෙන් sendMessage එකක් ඕන වෙන්නේ නැහැ
    alias: ["allmenu", "panel", "commands"],
    desc: "Show all command categories",
    category: "main",
    filename: __filename,
  },
  async (test, m, msg, { from, sender, pushname, reply }) => {
    try {
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
╭━━〔 ⚡ SITHIJA MD ⚡ 〕━━⬣
┃ 👤 USER : ${pushname}
┃ 🚀 STATUS : ONLINE
┃ ⚡ SPEED : ${Math.floor(Math.random() * 100)}ms
┃ 💻 VERSION : 1.0.0
┃ 📦 COMMANDS : ${commands.length}
╰━━━━━━━━━━━━━━⬣

╭━━〔 COMMAND LIST 〕━━⬣
`;

      categories.forEach((cat, i) => {
        const emoji = (i + 1)
          .toString()
          .split("")
          .map((n) => numberEmojis[n])
          .join("");
        menuText += `┃ ${emoji} ${cat}\n`;
      });

      menuText += `╰━━━━━━━━━━━━━━⬣`;

      // මෙතනින් විතරක් මැසේජ් එක යවන්න
      await test.sendMessage(
        from,
        {
          image: {
            url: defaultImage, // MAIN කියලා category එකක් menuImages එකේ නැති නිසා කෙලින්ම defaultImage එක දැම්මා
          },
          caption: menuText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "SITHIJA MD",
              body: "MULTI DEVICE WHATSAPP BOT",
              thumbnailUrl: defaultImage,
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
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
