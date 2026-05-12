const { cmd } = require("../command");

// SETTINGS SAVE
global.settings = {
    autoReact: false,
    autoSeen: false,
    antiDelete: false
};

// ================= SETTINGS MENU =================

cmd({
    pattern: "setting",
    react: "⚙️",
    desc: "Bot Settings",
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
┃ ➤ ${global.settings.autoReact ? "🟢 ON" : "🔴 OFF"}

┃ 2️⃣ ➤ Auto Seen 👀
┃ ➤ ${global.settings.autoSeen ? "🟢 ON" : "🔴 OFF"}

┃ 3️⃣ ➤ Anti Delete 🚫
┃ ➤ ${global.settings.antiDelete ? "🟢 ON" : "🔴 OFF"}

╰━━━━━━━━━━━━━━━━━━⬣

💡 Reply Only Number
`;

await conn.sendMessage(from,{
    image:{
        url:"https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/alive.png?raw=true"
    },
    caption: txt,
    mentions:[sender]
},{quoted:mek});

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

global.settings.autoReact =
!global.settings.autoReact;

return reply(
`😍 Auto React ${
global.settings.autoReact
? "Enabled 🟢"
: "Disabled 🔴"
}`
);

}

if(body === "2"){

global.settings.autoSeen =
!global.settings.autoSeen;

return reply(
`👀 Auto Seen ${
global.settings.autoSeen
? "Enabled 🟢"
: "Disabled 🔴"
}`
);

}

if(body === "3"){

global.settings.antiDelete =
!global.settings.antiDelete;

return reply(
`🚫 Anti Delete ${
global.settings.antiDelete
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

if(!global.settings.autoReact) return;

const emojis = [
"😍","🔥","⚡","💀","🥶","😎","😂"
];

const emoji =
emojis[Math.floor(Math.random()*emojis.length)];

await conn.sendMessage(
mek.key.remoteJid,
{
react:{
text:emoji,
key:mek.key
}
}
);

});

// ================= AUTO SEEN =================

cmd({
    on: "body"
},
async (conn, mek, m) => {

if(!global.settings.autoSeen) return;

await conn.readMessages([mek.key]);

});

// ================= ANTI DELETE =================

cmd({
    on: "delete"
},
async (conn, mek, m, {
    from
}) => {

if(!global.settings.antiDelete) return;

await conn.sendMessage(from,{
text:"🚫 Message Deleted!"
});

});
