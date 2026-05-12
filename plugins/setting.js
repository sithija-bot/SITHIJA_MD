const { cmd } = require("../command");

cmd({
    pattern: "setting",
    react: "⚙️",
    desc: "Bot settings panel",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply,
    sender
}) => {

const settingText = `
╭━━━〔 *SITHIJA MD SETTINGS* 〕━━━⬣
┃
┃ 👤 User : @${sender.split("@")[0]}
┃ 👑 Bot  : SITHIJA MD
┃
┣━━━〔 SETTINGS MENU 〕━━━⬣
┃ 1️⃣ AUTO REACT
┃ 2️⃣ AUTO STATUS SEEN
┃ 3️⃣ ANTI DELETE
┃ 4️⃣ AUTO VOICE
┃ 5️⃣ AUTO STICKER
┃ 6️⃣ OWNER MODE
┃ 7️⃣ GROUP MODE
┃ 8️⃣ PRIVATE MODE
┃
╰━━━━━━━━━━━━━━━━━━⬣

> Reply With Number To Change Setting
`;

await conn.sendMessage(from, {
    image: {
        url: "https://files.catbox.moe/8f6m8w.jpg"
    },
    caption: settingText,
    mentions: [sender]
}, { quoted: mek });

});
