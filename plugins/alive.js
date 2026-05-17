const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (danuwa, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {

        await danuwa.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG,
            footer: "Powered By Sithija",
            buttons: [
                {
                    buttonId: ".menu",
                    buttonText: { displayText: "📜 MENU" },
                    type: 1
                },
                {
                    buttonId: ".ping",
                    buttonText: { displayText: "⚡ PING" },
                    type: 1
                }
            ],
            headerType: 4
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
