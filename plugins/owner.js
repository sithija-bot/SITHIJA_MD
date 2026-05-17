```js
const { cmd } = require("../command");

cmd({
    pattern: "owner",
    desc: "Owner contact",
    category: "ownermenu",
    filename: __filename
},
async (danuwa, mek, m, { from }) => {

await danuwa.sendMessage(from, {
    contacts: {
        displayName: "SITHIJA OWNER",
        contacts: [{
            vcard: `BEGIN:VCARD
VERSION:1.0
FN:Sithija
ORG:SITHIJA MD;
TEL;type=CELL;type=VOICE;waid=94785936039:+94 78 593 6039
END:VCARD`
        }]
    }
}, { quoted: mek });

});
```
