const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

let autoStatusSave = false;

cmd(
  {
    pattern: 'autostatus',
    desc: 'Turn auto status save ON/OFF',
    category: 'owner',
    react: '📥',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply, isOwner }) => {
   
    const action = args[0];

    if (action === 'on') {
      autoStatusSave = true;
      return reply('✅ Auto Status Save ON');
    }

    if (action === 'off') {
      autoStatusSave = false;
      return reply('❌ Auto Status Save OFF');
    }

    reply('.autostatus on / off');
  }
);

cmd(
  {
    on: 'status',
  },
  async (conn, mek, m) => {
    try {
      if (!autoStatusSave) return;

      const msg = mek.message;

      if (msg.imageMessage || msg.videoMessage) {
        await conn.copyNForward(mek.chat, mek, false);
      }
    } catch (e) {
      console.log(e);
    }
  }
);
