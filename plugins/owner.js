const { cmd } = require("../command");

cmd({
    pattern: "owner",
    desc: "Show owner number",
    category: "main",
    react: "👑",
    filename: __filename
},
async (danuwa, mek, m, {
    from,
    reply
}) => {

try {

const ownerText = `
╔═══════〔 👑 OWNER INFO 👑 〕═══════╗

👤 *OWNER* : SITHIJA
📞 *NUMBER* : wa.me/94785936039
🌸 *CLICK THE LINK TO CHAT DIRECTLY*

> ⚡ POWERED BY SITHIJA-MD
`;

await danuwa.sendMessage(from, {
    text: ownerText
}, { quoted: mek });

} catch (e) {
console.log(e);
reply(`${e}`);
}
});
