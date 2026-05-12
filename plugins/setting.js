const { cmd } = require("../command");

global.settings = {
    autoReact: false,
    autoSeen: false,
    antiDelete: false
};

// SETTINGS MENU
cmd({
    pattern: "setting",
    react: "⚙️",
    desc: "Bot Settings",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    reply
}) => {

const txt = `
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

return reply(txt);

});

// REPLY HANDLER
cmd({
    filter: (body) =>
    ["1","2","3"].includes(body)
},
async (conn, mek, m, {
    body,
    reply,
    from
}) => {

// AUTO REACT
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

// AUTO SEEN
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

// ANTI DELETE
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

// AUTO REACT + AUTO SEEN
module.exports.onMessage = async (conn, mek) => {

const from = mek.key.remoteJid;

if(global.settings.autoSeen){

await conn.readMessages([mek.key]);

}

if(global.settings.autoReact){

const emojis = [
"😍","🔥","⚡","😂","🥶"
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

};

// ANTI DELETE
module.exports.onDelete = async (conn, updates) => {

if(!global.settings.antiDelete) return;

for(const update of updates){

if(update.update?.message === null){

await conn.sendMessage(
update.key.remoteJid,
{
text:"🚫 Deleted Message Detected!"
}
);

}

}

};
