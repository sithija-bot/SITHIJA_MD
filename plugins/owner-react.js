const config = require("../config");

module.exports = async (conn, mek) => {

try {

const from = mek.key.remoteJid;

const sender = mek.key.participant || mek.key.remoteJid;

if (!sender.includes(config.OWNER_NUMBER)) return;

const emojis = ["🔥","❤️","⚡","😄","🤖","💀","✨"];

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
