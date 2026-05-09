const { cmd } = require("../command");

cmd({
  pattern: "jid",
  react: "🆔",
  desc: "Get current chat jid",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {

  reply(`🆔 CHAT JID\n\n${from}`);

});


cmd({
  pattern: "forward",
  react: "📨",
  desc: "Forward replied message",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {

  if (!q) {
    return reply("❌ Give target JID");
  }

  if (!mek.quoted) {
    return reply("❌ Reply to a message");
  }

  try {

    await conn.copyNForward(
      q,
      mek.quoted,
      true
    );

    reply("✅ Message forwarded");

  } catch (e) {

    console.log(e);

    reply("❌ Forward failed");

  }

});
