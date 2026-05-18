const { cmd } = require("../command");

cmd({
    pattern: "owner",
    desc: "Show owner",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (danuwa, mek, m, {
    from,
    reply
}) => {

try {

await danuwa.sendMessage(from, {
    text: "👑 SITHIJA OWNER",
    footer: "SITHIJA-MD",
    buttons: [
        {
            buttonId: ".owner",
            buttonText: { displayText: "👑 OWNER" },
            type: 1
        },
        {
            buttonId: "https://wa.me/94785936039",
            buttonText: { displayText: "💬 CHAT OWNER" },
            type: 1
        }
    ],
    headerType: 1
}, { quoted: mek });

} catch (e) {
console.log(e);
reply(`${e}`);
}
});
