const { cmd } = require('../command');

cmd({
    pattern: "ownerreact",
    desc: "Auto react to owner messages",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { from, isOwner }) => {

if (!isOwner) return;

const emojis = ['🔥','😄','⚡','❤️','🤖'];

const emoji = emojis[Math.floor(Math.random() * emojis.length)];

await conn.sendMessage(from, {
    react: {
        text: emoji,
        key: mek.key
    }
});

});
