const { cmd } = require("../command");

let settings = {
    autoReact: false,
    autoSeen: false,
    antiDelete: false
};

// ================= SETTINGS MENU =================

cmd({
    pattern: "setting",
    react: "⚙️",
    desc: "Bot Settings Panel",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from,
    sender
}) => {

const txt = `
╭━━━〔 ⚙️ *SITHIJA MD SETTINGS* ⚙️ 〕━━━⬣

┃ 1️⃣ ➤ Auto React 😍
┃ ➤ ${settings.autoReact ? "🟢 ON" : "🔴 OFF"}

┃ 2️⃣ ➤ Auto Seen 👀
┃ ➤ ${settings.autoSeen ? "🟢 ON" : "🔴 OFF"}

┃ 3️⃣ ➤ Anti Delete 🚫
┃ ➤ ${settings.antiDelete ? "🟢 ON" : "🔴 OFF"}

╰━━━━━━━━━━━━━━━━━━⬣

💡 Reply Number To Change Setting
`;

await conn.sendMessage(from, {
    image: {
        url: "https://files.catbox.moe/8f6m8w.jpg"
    },
    caption: txt,
    mentions: [sender]
}, { quoted: mek });

});

// ================= TOGGLE SETTINGS =================

cmd({
    on: "body"
},
async (conn, mek, m, {
    body,
    reply
}) => {

if(body === "1"){
    settings.autoReact = !settings.autoReact;

    return reply(
        `😍 Auto React ${
            settings.autoReact
            ? "Enabled 🟢"
            : "Disabled 🔴"
        }`
    );
}

if(body === "2"){
    settings.autoSeen = !settings.autoSeen;

    return reply(
        `👀 Auto Seen ${
            settings.autoSeen
            ? "Enabled 🟢"
            : "Disabled 🔴"
        }`
    );
}

if(body === "3"){
    settings.antiDelete = !settings.antiDelete;

    return reply(
        `🚫 Anti Delete ${
            settings.antiDelete
            ? "Enabled 🟢"
            : "Disabled 🔴"
        }`
    );
}

});

// ================= AUTO REACT =================

cmd({
    on: "body"
},
async (conn, mek, m) => {

if(!settings.autoReact) return;

const emojis = [
    "😍",
    "🔥",
    "⚡",
    "💀",
    "🥶",
    "😎",
    "😂"
];

const emoji =
    emojis[Math.floor(Math.random() * emojis.length)];

await conn.sendMessage(mek.key.remoteJid, {
    react: {
        text: emoji,
        key: mek.key
    }
});

});

// ================= AUTO SEEN =================

cmd({
    on: "body"
},
async (conn, mek, m) => {

if(!settings.autoSeen) return;

await conn.readMessages([mek.key]);

});

// ================= ANTI DELETE =================

cmd({
    on: "delete"
},
async (conn, mek, m, {
    from
}) => {

if(!settings.antiDelete) return;

try {

await conn.sendMessage(from, {
    text: "🚫 Message Deleted!"
});

} catch (e) {
console.log(e);
}

});
