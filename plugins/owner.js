const { cmd } = require("../command");

cmd({
    pattern: "owner",
    desc: "Show Owner Contact",
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
    contacts: {
        displayName: "SITHIJA OWNER",
        contacts: [{
            displayName: "SITHIJA",
            vcard: `BEGIN:VCARD
VERSION:1.0
N:SITHIJA;;;;
FN:SITHIJA
ORG:SITHIJA-MD;
TEL;type=CELL;type=VOICE;waid=94785936039:+94 78 593 6039
END:VCARD`
        }]
    }
}, { quoted: mek });

} catch (e) {
console.log(e);
reply(`${e}`);
}
});
