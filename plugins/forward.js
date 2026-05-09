const { cmd } = require('../command');

cmd(
  {
    pattern: 'forward',
    alias: ['froward'],
    desc: 'Forward replied message to given JID/group',
    category: 'utility',
    react: '📨',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    try {
      // Check replied message
      if (!mek.quoted) {
        return reply('❌ Reply karapu message ekakata .forward groupjid gahanna');
      }

      // Check jid
      if (!args[0]) {
        return reply(
          '❌ Group JID eka denna\n\nExample:\n.forward 1203630xxxxxxx@g.us'
        );
      }

      const targetJid = args[0].trim();

      // Forward message
      await conn.forwardMessage(targetJid, mek.quoted.message, false);

      reply(`✅ Message forwarded to:\n${targetJid}`);
    } catch (e) {
      console.log(e);
      reply('❌ Forward failed');
    }
  }
);
