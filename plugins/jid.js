const { cmd } = require('../command');

cmd(
  {
    pattern: 'jid',
    desc: 'Get current chat JID',
    category: 'utility',
    react: '🆔',
    filename: __filename,
  },
  async (conn, mek, m, { reply, from }) => {
    reply(`Chat JID:\n${from}`);
  }
);
