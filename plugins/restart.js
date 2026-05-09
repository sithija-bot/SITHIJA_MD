const { cmd } = require('../command');

cmd(
  {
    pattern: 'restart',
    alias: ['resetart'],
    desc: 'Restart the bot',
    category: 'owner',
    react: '♻️',
    filename: __filename,
  },
  async (conn, mek, m, { reply, isOwner }) => {
    try {
      // Owner only
      if (!isOwner) {
        return reply('❌ Only bot owner can use this command');
      }

      await reply('♻️ Bot restarting...');

      process.exit(1);
    } catch (e) {
      console.log(e);
      reply('❌ Restart failed');
    }
  }
);
