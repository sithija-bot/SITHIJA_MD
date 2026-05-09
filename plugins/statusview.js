const { cmd } = require('../command');

let autoView = false;

cmd(
  {
    pattern: 'statusview',
    desc: 'Auto view status ON/OFF',
    category: 'owner',
    react: '👀',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply, isOwner }) => {
 
    const action = args[0];

    if (action === 'on') {
      autoView = true;
      return reply('✅ Auto Status View ON');
    }

    if (action === 'off') {
      autoView = false;
      return reply('❌ Auto Status View OFF');
    }

    reply('.statusview on / off');
  }
);

cmd(
  {
    on: 'status',
  },
  async (conn, mek, m) => {
    try {
      if (!autoView) return;

      await conn.readMessages([mek.key]);
    } catch (e) {
      console.log(e);
    }
  }
);
