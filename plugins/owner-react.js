const config = require("../config");

module.exports = async (conn, mek) => {

try {

const from = mek.key.remoteJid;

const sender = mek.key.participant || mek.key.remoteJid;

if (!sender.includes(config.OWNER_NUMBER)) return;

const emojis = ["🔥","❤️","⚡","😄","🤖","💀","✨"];const { cmd } = require("../command");

let react_status = true;

cmd({
    pattern: "react",
    desc: "Turn auto react on/off",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { q, isOwner, reply }) => {

if (!isOwner) return reply("❌ Owner only");

if (q === "on") {
    react_status = true;
    return reply("✅ Auto react turned ON");
}

if (q === "off") {
    react_status = false;
    return reply("❌ Auto react turned OFF");
}

reply(".react on / off");

});

module.exports = async (conn, mek) => {

try {

if (!react_status) return;

const from = mek.key.remoteJid;

const sender = mek.key.participant || mek.key.remoteJid;

if (!sender.includes("YOUR_NUMBER")) return;

const emojis = ["🔥","❤️","⚡","😄","🤖","✨"];

const emoji = emojis[Math.floor(Math.random() * emojis.length)];

await conn.sendMessage(from, {
    react: {
        text: emoji,
        key: mek.key
    }
});

} catch(e) {
console.log(e);
}

};

const emoji = emojis[Math.floor(Math.random() * emojis.length)];

await conn.sendMessage(from, {
react: {
text: emoji,
key: mek.key
}
});

} catch (e) {
console.log(e);
}

};
