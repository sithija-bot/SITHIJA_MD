const { cmd } = require("../command");

cmd({
  pattern: "jid",
  react: "🆔",
  desc: "Get current chat JID",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {

  return reply(
`╭━━〔 CHAT JID 〕━━⬣

🆔 ${from}

╰━━━━━━━━━━━━━━⬣`
  );

});


cmd({
  pattern: "forward",
  react: "📨",
  desc: "Forward replied message to jid",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {

  if (!q) {
    return reply(
`📨 Example:

.forward 947xxxxxxxx@s.whatsapp.net

Reply to a message`
    );
  }

  if (!mek.quoted) {
    return reply("❌ Reply to a message");
  }

  try {

    await conn.forwardMessage(
      q,
      mek.quoted.message,
      false
    );

    reply("✅ Message forwarded successfully");

  } catch (e) {

    console.log(e);

    reply("❌ Failed to forward message");

  }

});
