const { cmd, commands } = require("../command");

const pendingMenu = {};

const numberEmojis = [
  "1️⃣","2️⃣","3️⃣","4️⃣","5️⃣",
  "6️⃣","7️⃣","8️⃣","9️⃣","🔟"
];

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
 CATEGORY IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const categoryImages = {

  DOWNLOAD: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.31.20.jpeg?raw=true",
  SEARCH: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.36.00.jpeg?raw=true",
  GROUP: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.57.jpeg?raw=true",
  OWNER: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.32.49.jpeg?raw=true",
  AI: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.35.23.jpeg?raw=true",
  MOVIE: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/WhatsApp%20Image%202026-05-10%20at%2018.34.11.jpeg?raw=true"
};

const mainImage =
  "https://raw.githubusercontent.com/sithija-bot/SITHIJA_MD/main/images/menu.jpg";

cmd({
  pattern: "menu",
  react: "🌸",
  desc: "Interactive menu",
  category: "main",
  filename: __filename
}, async (conn, m, msg, { from, sender }) => {

  const commandMap = {};

  for (const command of commands) {

    if (command.dontAddCommandList) continue;

    const category = (command.category || "misc").toUpperCase();

    // REMOVE MISC CATEGORY
    if (category === "MISC") continue;

    if (!commandMap[category]) {
      commandMap[category] = [];
    }

    commandMap[category].push(command);
  }

  const categories = Object.keys(commandMap);

  // TOTAL COMMANDS
  const totalCommands = commands.filter(
    cmd =>
      !cmd.dontAddCommandList &&
      (cmd.category || "misc").toUpperCase() !== "MISC"
  ).length;

  // BOT PING
  const ping = Date.now() - (m.messageTimestamp * 1000);

  let menu = `
╭━━━〔 *SITHIJA MD* 〕━━━⬣
┃ ✦ User : @${sender.split("@")[0]}
┃ ✦ Prefix : .
┃ ✦ Mode : Public
┃ ✦ Bot Ping : ${ping} ms
┃ ✦ Total Cmds : ${totalCommands}
╰━━━━━━━━━━━━━━⬣

╭━━〔 *MENU LIST* 〕━━⬣
`;

  categories.forEach((cat, i) => {
    menu += `┃ ${numberEmojis[i] || "🔹"} ${cat}\n`;
  });

  menu += `╰━━━━━━━━━━━━━━⬣

🌸 Reply with category number`;

  await conn.sendMessage(from, {
    image: { url: mainImage },
    caption: menu,
    mentions: [sender]
  }, { quoted: m });

  pendingMenu[sender] = {
    step: "category",
    commandMap,
    categories
  };
});

cmd({
  filter: (text, { sender }) =>
    pendingMenu[sender] &&
    pendingMenu[sender].step === "category" &&
    /^[1-9][0-9]*$/.test(text.trim())

}, async (conn, m, msg, { from, body, sender, reply }) => {

  const data = pendingMenu[sender];

  if (!data) return;

  const index = parseInt(body.trim()) - 1;

  if (index < 0 || index >= data.categories.length) {
    return reply("❌ Invalid Number");
  }

  const selectedCategory = data.categories[index];
  const cmds = data.commandMap[selectedCategory];

  /*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
   CATEGORY IMAGE SELECT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  */

  const categoryImage = categoryImages[selectedCategory];

  let text = `
╭━━━〔 *${selectedCategory} MENU* 〕━━━⬣

`;

  cmds.forEach((cmdData, i) => {

    const patterns = [
      cmdData.pattern,
      ...(cmdData.alias || [])
    ]
      .filter(Boolean)
      .map(p => `.${p}`);

    text += `┃ ${numberEmojis[i] || "🔹"} ${patterns.join(", ")}\n`;
    text += `┃ ✦ ${cmdData.desc || "No Description"}\n`;
    text += `┃\n`;
  });

  text += `╰━━━━━━━━━━━━━━⬣

🌸 Total Commands : ${cmds.length}
💖 Powered By SITHIJA MD`;

  await conn.sendMessage(from, {
    image: { url: categoryImage },
    caption: text
  }, { quoted: m });

  delete pendingMenu[sender];
});
