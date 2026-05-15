const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const express = require('express');
const path = require('path');
const { File } = require('megajs');

const config = require('./config');
const { sms } = require('./lib/msg');

const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94785936039'];

const credsPath = path.join(__dirname, '/auth_info_baileys/creds.json');

let sock;
let isConnecting = false;

global.commands = [];
global.replyHandlers = [];

/* ================= SESSION ================= */
async function ensureSessionFile() {
  if (!fs.existsSync(credsPath)) {
    if (!config.SESSION_ID) {
      console.error("❌ SESSION_ID missing");
      process.exit(1);
    }

    console.log("🔄 Downloading session...");

    const filer = File.fromURL(`https://mega.nz/file/${config.SESSION_ID}`);

    filer.download((err, data) => {
      if (err) {
        console.error("❌ Session download failed", err);
        process.exit(1);
      }

      fs.mkdirSync(path.dirname(credsPath), { recursive: true });
      fs.writeFileSync(credsPath, data);

      console.log("✅ Session saved");
      setTimeout(connectToWA, 2000);
    });
  } else {
    setTimeout(connectToWA, 1000);
  }
}

/* ================= PLUGINS ================= */
function loadPlugins() {
  global.commands = [];
  global.replyHandlers = [];

  fs.readdirSync("./plugins").forEach((file) => {
    if (!file.endsWith(".js")) return;

    delete require.cache[require.resolve(`./plugins/${file}`)];
    const plugin = require(`./plugins/${file}`);

    if (plugin?.cmd) global.commands.push(plugin.cmd);
    if (Array.isArray(plugin?.commands)) global.commands.push(...plugin.commands);
    if (plugin?.replyHandler) global.replyHandlers.push(plugin.replyHandler);
  });

  console.log(`✅ Plugins loaded: ${global.commands.length}`);
}

/* ================= CONNECT ================= */
async function connectToWA() {
  if (isConnecting) return;
  isConnecting = true;

  console.log("Connecting SITHIJA-MD...");

  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, '/auth_info_baileys/')
  );

  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version
  });

  /* ================= CONNECTION ================= */
  sock.ev.on('connection.update', async (u) => {
    const { connection, lastDisconnect } = u;

    if (connection === 'open') {
      console.log('✅ Connected');
      isConnecting = false;

      loadPlugins();

      await sock.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
        text: "SITHIJA-MD connected ✅"
      });
    }

    if (connection === 'close') {
      isConnecting = false;

      const code = lastDisconnect?.error?.output?.statusCode;

      console.log("❌ Connection closed:", code);

      // 🔥 FIX 440 / LOGGED OUT
      if (code === DisconnectReason.loggedOut || code === 440) {
        console.log("❌ Session broken - delete auth folder");
        return;
      }

      setTimeout(connectToWA, 4000);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  /* ================= MESSAGE HANDLER ================= */
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const mek = messages[0];
    if (!mek?.message) return;

    mek.message =
      getContentType(mek.message) === 'ephemeralMessage'
        ? mek.message.ephemeralMessage.message
        : mek.message;

    const m = sms(sock, mek);
    const from = mek.key.remoteJid;
    const type = getContentType(mek.message);

    const body =
      type === 'conversation'
        ? mek.message.conversation
        : type === 'extendedTextMessage'
        ? mek.message.extendedTextMessage.text
        : type === 'imageMessage'
        ? mek.message.imageMessage.caption
        : type === 'videoMessage'
        ? mek.message.videoMessage.caption
        : '';

    const isCmd = body.startsWith(prefix);
    const commandName = isCmd ? body.slice(1).split(" ")[0].toLowerCase() : '';
    const args = body.split(/ +/).slice(1);

    const reply = (text) =>
      sock.sendMessage(from, { text }, { quoted: mek });

    /* ================= COMMAND ================= */
    if (isCmd) {
      const cmd = global.commands.find(
        (c) => c.pattern === commandName || (c.alias && c.alias.includes(commandName))
      );

      if (cmd) {
        try {
          if (cmd.react) {
            await sock.sendMessage(from, {
              react: { text: cmd.react, key: mek.key }
            });
          }

          await cmd.function(sock, mek, m, { from, args, reply });
        } catch (e) {
          console.log("CMD ERROR", e);
        }
      }
    }

    /* ================= REPLY ================= */
    for (const h of global.replyHandlers) {
      if (h.filter(body, { message: mek })) {
        try {
          await h.function(sock, mek, m, { from, reply });
          break;
        } catch (e) {
          console.log("Reply error", e);
        }
      }
    }

    /* ================= STATUS FIX ================= */
    if (from === 'status@broadcast') {
      try {
        // 👁️ seen
        await sock.readMessages([mek.key]);

        // ❤️ react
        const emojis = ['❤️','🔥','💯','💫','💙','💚','💜','🖤','✨','🌸'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        if (mek.key.participant) {
          await sock.sendMessage(mek.key.participant, {
            react: { text: emoji, key: mek.key }
          });
        }

        console.log("✅ Status seen + reacted");
      } catch (e) {
        console.log("❌ Status error", e);
      }
    }
  });
}

/* ================= START ================= */
ensureSessionFile();

app.get("/", (req, res) => {
  res.send("SITHIJA-MD RUNNING ✅");
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
