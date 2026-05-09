const { cmd } = require('../command');

let autoReact = false;

const emojis = [
  '❤️',
  '🔥',
  '😂',
  '🥰',
  '⚡',
  '💀',
  '🤍',
  '✨',
  '😹',
  '😎'
];

cmd(
  {
    pattern: 'autoreact',
    desc: 'Turn auto react ON/OFF',
    category: 'owner',
    react: '⚡',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    const action = args[0];

    if (action === 'on') {
      autoReact = true;
      return reply('✅ Auto React ON');
    }

    if (action === 'off') {
      autoReact = false;
      return reply('❌ Auto React OFF');
    }

    reply('.autoreact on / off');
  }
);

cmd(
  {
    on: 'message',
  },
  async (conn, mek, m) => {
    try {
      if (!autoReact) return;

      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      await conn.sendMessage(mek.chat, {
        react: {
          text: emoji,
          key: mek.key,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
);
