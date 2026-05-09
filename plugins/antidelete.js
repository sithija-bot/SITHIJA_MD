const { cmd } = require('../command');

let antiDelete = true;
const store = {};

cmd(
  {
    pattern: 'antidelete',
    desc: 'Turn anti delete ON/OFF',
    category: 'owner',
    react: '🛡️',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply('❌ Owner only');

    const action = args[0];

    if (action === 'on') {
      antiDelete = true;
      return reply('✅ Anti Delete ON');
    }

    if (action === 'off') {
      antiDelete = false;
      return reply('❌ Anti Delete OFF');
    }

    reply('.antidelete on / off');
  }
);

cmd(
  {
    on: 'message',
  },
  async (conn, mek, m) => {
    try {
      store[mek.key.id] = mek;
    } catch (e) {
      console.log(e);
    }
  }
);

cmd(
  {
    on: 'delete',
  },
  async (conn, mek, m) => {
    try {
      if (!antiDelete) return;

      const deleted = store[mek.key.id];

      if (!deleted) return;

      await conn.sendMessage(mek.chat, {
        text: '🚫 Deleted Message Recovered'
      });

      await conn.copyNForward(mek.chat, deleted, false);
    } catch (e) {
      console.log(e);
    }
  }
);
