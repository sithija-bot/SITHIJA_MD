const { cmd } = require("../command");

cmd({
    pattern: "owner",
    desc: "Owner Contact",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (danuwa, mek, m, {
    from,
    reply
}) => {

try {

await danuwa.sendMessage(
from,
{
contacts: {
displayName: "SITHIJA OWNER",
contacts: [{
vcard: `BEGIN:VCARD
VERSION:3.0
FN:SITHIJA OWNER
TEL;type=CELL;type=VOICE;waid=94785936039:+94785936039
END:VCARD`
}]
}
},
{ quoted: mek }
);

} catch (e) {
console.log(e);
reply("❌ Owner contact send failed");
}
});
