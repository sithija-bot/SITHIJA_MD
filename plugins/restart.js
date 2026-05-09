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
     

      await reply('♻️ Bot restarting...');

      process.exit(1);
    } catch (e) {
      console.log(e);
      reply('❌ Restart failed');
    }
  }
);
