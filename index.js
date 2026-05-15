const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const express = require('express');
const axios = require('axios');
const path = require('path');
const qrcode = require('qrcode-terminal');
const NodeCache = require('node-cache');

const config = require('./config');
const { sms, downloadMediaMessage } = require('./lib/msg');
const {
  getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson
} = require('./lib/functions');
const { File } = require('megajs');
const { commands, replyHandlers } = require('./command');

const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94785936039'];
const credsPath = path.join(__dirname, '/auth_info_baileys/creds.json');
const msgRetryCounterCache = new NodeCache();

const cooldown = new Map();
const groupCooldown = new Map();

function antiSpam(sender, isGroup = false) {
  const map = isGroup ? groupCooldown : cooldown;

  if (map.has(sender)) {
    return false;
  }

  map.set(sender, true);

  setTimeout(() => {
    map.delete(sender);
  }, isGroup ? 8000 : 4000);

  return true;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureSessionFile() {
  if (!fs.existsSync(credsPath)) {
    if (!config.SESSION_ID) {
      console.error('❌ SESSION_ID env variable is missing. Cannot restore session.');
      process.exit(1);
    }

    console.log("🔄 creds.json not found. Downloading session from MEGA...");

    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

    filer.download((err, data) => {
      if (err) {
        console.error("❌ Failed to download session file from MEGA:", err);
        process.exit(1);
      }

      fs.mkdirSync(path.join(__dirname, '/auth_info_baileys/'), { recursive: true });
      fs.writeFileSync(credsPath, data);
      console.log("✅ Session downloaded and saved. Restarting bot...");
      setTimeout(() => {
        connectToWA();
      }, 2000);
    });
  } else {
    setTimeout(() => {
      connectToWA();
    }, 1000);
  }
}

const antiDeletePlugin = require('./plugins/antidelete.js');
global.pluginHooks = global.pluginHooks || [];
global.pluginHooks.push(antiDeletePlugin);

async function connectToWA() {
  console.log("Connecting SITHIJA-MD 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '/auth_info_baileys/'));
  const { version } = await fetchLatestBaileysVersion();

const test = makeWASocket({
  logger: P({ level: 'silent' }),
  printQRInTerminal: false,
  browser: Browsers.macOS("Firefox"),
  auth: state,
  version,

  syncFullHistory: false,
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: true,

  defaultQueryTimeoutMs: undefined,
  connectTimeoutMs: 60000,
  keepAliveIntervalMs: 10000,

  msgRetryCounterCache,

  emitOwnEvents: false,
  fireInitQueries: true,

  retryRequestDelayMs: 250,
  maxMsgRetryCount: 5,
});
  
  test.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
if (connection === 'close') {

  console.log("❌ Connection closed");

  const shouldReconnect =
    lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

} else if (connection === 'open') {

  console.log('✅ SITHIJA-MD connected to WhatsApp');

        const up = `╭━━━〔 SITHIJA-MD 〕━━━⬣
┃ ✅ Bot Connected Successfully
┃ 🌐 Prefix : ${prefix}
╰━━━━━━━━━━━━━━⬣`;

    await test.sendMessage(
      ownerNumber[0] + "@s.whatsapp.net",
      {
        image: {
          url: "https://github.com/sithija-bot/SITHIJA_MD/blob/main/images/alive.png?raw=true"
        },
        caption: up
      });

      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require(`./plugins/${plugin}`);
        }
      });
    }
  });

  test.ev.on('creds.update', saveCreds);

  test.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (msg.messageStubType === 68) {
        await test.sendMessageAck(msg.key);
      }
    }

    const mek = messages[0];
    if (!mek || !mek.message) return;
    mek.message = getContentType(mek.message) === 'ephemeralMessage' ? mek.message.ephemeralMessage.message : mek.message;

    if (global.pluginHooks) {
      for (const plugin of global.pluginHooks) {
        if (plugin.onMessage) {
          try {
            await plugin.onMessage(test, mek);
          } catch (e) {
            console.log("onMessage error:", e);
          }
        }
      }
    }

    if (mek.key?.remoteJid === 'status@broadcast') {
      const senderJid = mek.key.participant || mek.key.remoteJid || "unknown@s.whatsapp.net";
      
      if (config.AUTO_STATUS_SEEN === "true") {
        try {
          await test.readMessages([mek.key]);
          console.log(`[✓] Status seen: ${mek.key.id}`);
        } catch (e) {
          console.error("❌ Failed to mark status as seen:", e);
        }
      }

      if (config.AUTO_STATUS_REACT === "true" && mek.key.participant) {
        try {
          const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍'];
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

         await delay(5000);

      if (Math.random() > 0.4) return;

        await test.sendMessage(mek.key.participant, {
  
            react: {
              text: randomEmoji,
              key: mek.key,
            }
          });
          console.log(`[✓] Reacted to status of ${mek.key.participant} with ${randomEmoji}`);
        } catch (e) {
          console.error("❌ Failed to react to status:", e);
        }
      }
    } // <-- වැරැද්ද තිබුණේ මෙතැන (වරහන වසා නොතිබීම)
    
  if (mek.key.remoteJid === "status@broadcast") return;

if (mek.message?.call) return;

if (mek.key.remoteJid?.includes("broadcast")) return;

const spamCheck = antiSpam(
  mek.key.participant || mek.key.remoteJid,
  mek.key.remoteJid.endsWith("@g.us")
);

if (!spamCheck) return;

await delay(1500);
    
    const m = sms(test, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = (type === 'conversation') ? mek.message.conversation :
      (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
        (type == 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
          (type == 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';
    
    const isCmd = body.startsWith(prefix);
    const commandName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');

    const sender = mek.key.fromMe ? test.user.id : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const isGroup = from.endsWith('@g.us');
    const botNumber = test.user.id.split(':')[0];
    const pushname = mek.pushName || 'Sin Nombre';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(test.user.id);

    const groupMetadata = isGroup ? await test.groupMetadata(from).catch(() => {}) : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? groupMetadata.participants : '';
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

    const reply = (text) => test.sendMessage(from, { text }, { quoted: mek });

    if (isCmd) {
      const cmd = commands.find((c) => c.pattern === commandName || (c.alias && c.alias.includes(commandName)));
      if (cmd) {
        if (cmd.react) test.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
        try {
          cmd.function(test, mek, m, {
            from, quoted: mek, body, isCmd, command: commandName, args, q,
            isGroup, sender, senderNumber, botNumber2, botNumber, pushname,
            isMe, isOwner, groupMetadata, groupName, participants, groupAdmins,
            isBotAdmins, isAdmins, reply,
          });
        } catch (e) {
          console.error("[PLUGIN ERROR]", e);
        }
      }
    }

    for (const handler of replyHandlers) {
      if (handler.filter(body, { sender, message: mek })) {
        try {
          await handler.function(test, mek, m, {
            from, quoted: mek, body: body, sender, reply,
          });
          break;
        } catch (e) {
          console.log("Reply handler error:", e);
        }
      }
    }
  });

  test.ev.on('messages.update', async (updates) => {
    if (global.pluginHooks) {
      for (const plugin of global.pluginHooks) {
        if (plugin.onDelete) {
          try {
            await plugin.onDelete(test, updates);
          } catch (e) {
            console.log("onDelete error:", e);
          }
        }
      }
    }
  });
}

ensureSessionFile();

app.get("/", (req, res) => {
  res.send("Hey, SITHIJA-MD started✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));  meka safe d
