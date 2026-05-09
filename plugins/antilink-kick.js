const { cmd } = require("../command");

cmd({
    pattern: "antilink",
    desc: "Auto kick link senders",
    category: "group",
    filename: __filename
},
async(conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {

if (!isGroup) return;

if (!isBotAdmins) return reply("❌ Bot must be admin");

const msg = mek.message?.conversation || 
            mek.message?.extendedTextMessage?.text || "";

if (msg.includes("https://chat.whatsapp.com/")) {

if (isAdmins) return;

await reply("🚫 Group links are not allowed!\nUser will be removed.");

await conn.groupParticipantsUpdate(
    from,
    [sender],
    "remove"
);

}

});
