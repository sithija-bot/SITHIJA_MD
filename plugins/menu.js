const { cmd, commands } = require("../command");

const pendingMenu = {};

const numberEmojis = [
  "1️⃣","2️⃣","3️⃣","4️⃣","5️⃣",
  "6️⃣","7️⃣","8️⃣","9️⃣","🔟"
];

const mainImage =
  "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/ChatGPT%20Image%20May%2011,%202026,%2007_18_16%20PM.png?raw=true";

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
╭━━━〔 SITHIJA MD 〕━━━⬣
┃ ⚡ Status : Online
┃ 👑 Owner : Sithija
┃ 🧠 Bot Name : SITHIJA MD
┃ 📶 Ping : 24ms
┃ 🔥 Mode : Public
┃ 🌐 Platform : Railway
┃ 💻 Version : v1.0.0
╰━━━━━━━━━━━━━━━━━━⬣ 
🤖 Fast ⚡ • Secure 🔒 • Powerful 💪 • Always Active ♾️

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

  // CATEGORY IMAGE REMOVE
  // ONLY TEXT MESSAGE SEND

  await conn.sendMessage(from, {
    text: text
  }, { quoted: m });

  delete pendingMenu[sender];
});
