const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");

const pendingMenu = {};
const numberEmojis = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];

const headerImage = config.MENU_IMAGE || "https://github.com/sithija-bot/SITHIJA_MD/blob/main/alive.png1.png?raw=true";

cmd({
  pattern: "menu",
  react: "🌸",
  desc: "Show command categories",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {

  try {

    const uptime = process.uptime();
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const commandMap = {};

    for (const command of commands) {

      if (command.dontAddCommandList) continue;

      const category = (command.category || "OTHER").toUpperCase();

      if (!commandMap[category]) commandMap[category] = [];

      commandMap[category].push(command);
    }

    const categories = Object.keys(commandMap);

    let menuText = `
╔═══════〔 🌸 SITHIJA-MD 🌸 〕═══════╗

        👋 HELLO ${pushname}

✦ Welcome To The Anime World Of SITHIJA-MD ✦

╭───────────────❍
│ 👾 BOT : SITHIJA-MD
│ 👤 USER : ${pushname}
│ 📞 OWNER : ${config.OWNER_NUMBER}
│ ⏰ UPTIME : ${runtime(uptime)}
│ 📂 RAM : ${ram} MB
│ 📊 COMMANDS : ${commands.length}
│ 🪄 PREFIX : ${config.PREFIX}
╰───────────────❍

🌸 REPLY THE NUMBER BELOW 🌸

╭───────────────❍
`;

    categories.forEach((cat, i) => {

      const emojiIndex = (i + 1).toString()
      .split("")
      .map(n => numberEmojis[n])
      .join("");

      menuText += `│ ✧･ﾟ: *${i + 1}》${cat} MENU*\n`;
    });

    menuText += `╰───────────────❍

> ⚡ POWERED BY SITHIJA-MD`;

    await conn.sendMessage(from, {
      image: { url: headerImage },
      caption: menuText,
    }, { quoted: mek });

    pendingMenu[sender] = {
      step: "category",
      commandMap,
      categories
    };

  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
});

cmd({
  filter: (text, { sender }) =>
    pendingMenu[sender] &&
    pendingMenu[sender].step === "category" &&
    /^[1-9][0-9]*$/.test(text.trim())

}, async (conn, mek, m, { from, body, sender, reply }) => {

  try {

    const { commandMap, categories } = pendingMenu[sender];

    const index = parseInt(body.trim()) - 1;

    if (index < 0 || index >= categories.length)
      return reply("❌ Invalid selection.");

    const selectedCategory = categories[index];
    const cmdsInCategory = commandMap[selectedCategory];

    let cmdText = `
╔═══════〔 🌸 ${selectedCategory} MENU 🌸 〕═══════╗

╭───────────────❍
`;

    cmdsInCategory.forEach(c => {

      const patterns = [
        c.pattern,
        ...(c.alias || [])
      ]
      .filter(Boolean)
      .map(p => `.${p}`);

      cmdText += `│ ✦ ${patterns.join(", ")}
│ 🌸 ${c.desc || "No Description"}
│
`;
    });

    cmdText += `╰───────────────❍

📊 TOTAL COMMANDS : ${cmdsInCategory.length}

> ⚡ POWERED BY SITHIJA-MD`;

    await conn.sendMessage(from, {
      image: { url: headerImage },
      caption: cmdText,
    }, { quoted: mek });

    delete pendingMenu[sender];

  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
});

function runtime(seconds) {

  seconds = Number(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + "d " : "";
  const hDisplay = h > 0 ? h + "h " : "";
  const mDisplay = m > 0 ? m + "m " : "";
  const sDisplay = s > 0 ? s + "s" : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}
