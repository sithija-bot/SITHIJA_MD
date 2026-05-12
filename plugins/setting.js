const { cmd } = require("../command");

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
    reply
}) => {

const text = `
╭━━━〔 ⚙️ SITHIJA MD SETTINGS ⚙️ 〕━━━⬣

1️⃣ Auto React 😍
➤ ${global.settings.autoReact ? "🟢 ON" : "🔴 OFF"}

2️⃣ Auto Seen 👀
➤ ${global.settings.autoSeen ? "🟢 ON" : "🔴 OFF"}

3️⃣ Anti Delete 🚫
➤ ${global.settings.antiDelete ? "🟢 ON" : "🔴 OFF"}

╰━━━━━━━━━━━━━━━━━━⬣

Reply Number To Toggle
`;

await reply(text);

});

// ================= MAIN MESSAGE EVENT =================

cmd({
    on: "body"
},
async (conn, mek, m, {
    body,
    from,
    reply
}) => {

const text = body ? body.trim() : "";

// ================= TOGGLE SETTINGS =================

if(text === "1"){

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

if(text === "2"){

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

if(text === "3"){

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

// ================= AUTO REACT =================

if(global.settings.autoReact){

const emojis = [
    "😍",
    "🔥",
    "⚡",
    "😂",
    "🥶"
];

const emoji =
emojis[Math.floor(Math.random()*emojis.length)];

await conn.sendMessage(from,{
react:{
text:emoji,
key:mek.key
}
});

}

// ================= AUTO SEEN =================

if(global.settings.autoSeen){

await conn.readMessages([mek.key]);

}

});

// ================= ANTI DELETE =================

cmd({
    on: "delete"
},
async (conn, mek, m, {
    from
}) => {

if(!global.settings.antiDelete) return;

try {

await conn.sendMessage(from,{
text:"🚫 Deleted Message Detected!"
});

} catch(e){
console.log(e);
}

});
