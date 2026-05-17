const { cmd } = require("../command");

cmd({
    pattern: "menu",
    desc: "Bot menu",
    category: "main",
    filename: __filename
},
async (danuwa, mek, m, { from, pushname, reply }) => {

try {

const menuText = `
╭━━〔 🤖 SITHIJA MD 🤖 〕━━⬣
┃ 👋 Hello ${pushname}
┃ ⚡ Bot Status : Online
╰━━━━━━━━━━━━━━⬣

📌 Select Menu Category
`;

const buttonMessage = {
    image: { url: "https://files.catbox.moe/8tqwa6.jpg" },
    caption: menuText,
    footer: "Powered By Sithija",
    buttons: [
        {
            buttonId: ".downloadmenu",
            buttonText: {
                displayText: "📥 DOWNLOAD"
            },
            type: 1
        },
        {
            buttonId: ".groupmenu",
            buttonText: {
                displayText: "👥 GROUP"
            },
            type: 1
        },
        {
            buttonId: ".owner",
            buttonText: {
                displayText: "👑 OWNER"
            },
            type: 1
        }
    ],
    headerType: 4
};

await danuwa.sendMessage(from, buttonMessage, {
    quoted: mek
});

} catch(e) {
console.log(e);
reply("❌ Error generating menu.");
}

});
