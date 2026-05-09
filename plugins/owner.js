const { cmd } = require('../command');

cmd(
  {
    pattern: 'owner',
    desc: 'Show bot owner information',
    category: 'main',
    react: '👑',
    filename: __filename,
  },
  async (conn, mek, m, { reply }) => {
    try {
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Sithija Anuhas\nTEL;type=CELL;type=VOICE;waid=94785936039:+94 78 593 6039\nEND:VCARD`;

      await conn.sendMessage(mek.chat, {
        contacts: {
          displayName: 'Sithija Anuhas',
          contacts: [{ vcard }],
        },
      });

      reply('👑 Bot Owner: Sithija Anuhas');
    } catch (e) {
      console.log(e);
      reply('❌ Owner command error');
    }
  }
);
