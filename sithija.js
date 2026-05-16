const {
  default: makeWAconn,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  downloadContentFromMessage,
  fetchLatestBaileysVersion,
  Browsers,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
const os = require("os");
const path = require("path");
const fs = require("fs");
const P = require("pino");
const FileType = require("file-type");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const express = require("express");
const app = express();
const por = require("./session");
const port = por.PORT;
const ownerNumber = ["94785936039"];

if (!app) return;

// Session directory
const SESSION_DIR = "./sessions";
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR);

const sess = require("./session");

async function sessdl() {
  try {
    if (!sess || !sess.SESSION_ID) {
      throw new Error("SESSION_ID is missing in session.js file");
    }

    // Extract the Base64 encoded session data
    const parts = sess.SESSION_ID.split("SITHIJA-MD~");
    if (parts.length < 2) {
      throw new Error("Invalid SESSION_ID format - missing 'SITHIJA-MD~' separator");
    }
    const base64Data = parts;

    if (!base64Data || base64Data.trim() === "") {
      throw new Error("Base64 data is empty after splitting SESSION_ID");
    }

    // Delete the SESSION_DIR if it exists to ensure clean start
    if (await fs.promises.stat(SESSION_DIR).catch(() => false)) {
      await fs.promises.rm(SESSION_DIR, { recursive: true, force: true });
      console.log("✅ Existing session directory deleted.");
    }

    // Recreate the directory
    try {
      await fs.promises.mkdir(SESSION_DIR, { recursive: true });
      console.log("📁 New session directory created.");
    } catch (err) {
      console.error("❌ Error creating session directory:", err);
      return;
    }

    const credsPath = path.join(SESSION_DIR, "creds.json");

    // Decode and save the session data
    let decodedData;
    try {
      decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
    } catch (decodeErr) {
      console.error("❌ Error decoding Base64 data:", decodeErr.message);
      throw new Error("Failed to decode Base64 session data");
    }

    // Check if decoded data is empty
    if (!decodedData || decodedData.trim() === "") {
      throw new Error("Decoded session data is empty");
    }

    // Parse the JSON data with specific error handling
    let sessionData;
    try {
      sessionData = JSON.parse(decodedData);
    } catch (jsonErr) {
      console.error("❌ Invalid JSON format in session data:");
      console.error("Error details:", jsonErr.message);
      console.error("First 200 chars of decoded data:", decodedData.substring(0, 200));
      throw new Error(`JSON Parse Error: ${jsonErr.message}`);
    }

    // Write to creds.json
    try {
      await fs.promises.writeFile(credsPath, JSON.stringify(sessionData, null, 2));
      console.log("✅ Session data decoded and saved to creds.json successfully.");
    } catch (writeErr) {
      console.error("❌ Error writing session data to file:", writeErr.message);
      throw new Error("Failed to save session data to file");
    }

  } catch (err) {
    console.error("❌ Unexpected error in sessdl:", err);
    throw err;
  }
}

async function connectToWA() {
  try {
    console.log("🔄 Initializing session data...");
    await sessdl();
    console.log("✅ Session data initialized.");
  } catch (error) {
    console.error("❌ Error during session initialization:", error.message);
    console.log("⚠️ Bot cannot start without valid session data. Please check your SESSION_ID.");
    return; // Stop execution if session fails
  }

  const { loadCommands, handleCommand } = require("./src/utils/commandHandler");
  const config = require("./src/config/settings.cjs");
  const getPrefix = () => config.PREFIX;
  const getWelcome = () => config.WELCOME;

  //===========================
  console.log("🔥 SITHIJA-MD XPRO is starting...");
  
  const { state, saveCreds } = await useMultiFileAuthState(
    __dirname + "/sessions/"
  );
  
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWAconn({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  });

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === "close") {
      const shouldReconnect = (
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      );
      
      if (shouldReconnect) {
        console.log("🔄 Disconnect detected. Attempting to reconnect...");
        setTimeout(connectToWA, 5000); // Wait 5 seconds before reconnecting
      } else {
        console.log("❌ Logged out. Please scan QR code again.");
      }
    } else if (connection === "open") {
      console.log("🔥 Installing... ");
      console.log("connected to whatsapp ✅");
      
      let up = `
          🚀 **© SITHIJA-MD 𝗑ᴾᴿᴼ 💚 Connected Successfully!** ✅ 
          
          --- **🎉 Welcome to © SITHIJA-MD 𝗑ᴾᴿᴼ 💚!** 🎉 
          ✦» 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require("./package.json").version}
          ✦» 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}
          ✦» 𝙷𝚘𝚜𝚝 : ${os.hostname()}
          ✦» 𝙾𝚆𝙽𝙴𝚁: ${config.BOT_NUMBER}
          
          --- **Current Settings:**
          ✦» **PREFIX:** ${config.PREFIX}
          ✦» **MODE:** ${config.MODE}
          ✦» **AUTO READ STATUS:** ${
            config.AUTOREADSTATUS ? "Enabled" : "Disabled"
          }
          ✦» **READ CMD:** ${config.READCMD ? "Enabled" : "Disabled"}
          ✦» **AUTO VOICE:** ${config.AUTOVOICE ? "Enabled" : "Disabled"}
          ✦» **AUTO STICKER:** ${config.AUTOSTICKER ? "Enabled" : "Disabled"}
          ✦» **AUTO REPLY:** ${config.AUTOREPLY ? "Enabled" : "Disabled"}
          ✦» **AUTO REACT:** ${config.AUTOREACT ? "Enabled" : "Disabled"}
          ✦» **WELCOME:** ${config.WELCOME ? "Enabled" : "Disabled"}
          ✦» **ANTI BAD:** ${config.ANTIBAD ? "Enabled" : "Disabled"}
          ✦» **ANTI BOT:** ${config.ANTIBOT ? "Enabled" : "Disabled"}
          ✦» **ANTI LINK:** ${config.ANTILINK ? "Enabled" : "Disabled"}
          ✦» **ALWAYS ONLINE:** ${config.ALLWAYSONLINE ? "Enabled" : "Disabled"}
          ✦» **MOROCCO BLOCK:** ${config.MOROCCOBLOCK ? "Enabled" : "Disabled"}
          ✦» **AUTO NEWS:** ${config.AUTONEWS ? "Enabled" : "Disabled"}
          ✦» **AUTO TYPING:** ${config.AUTOTYPING ? "Enabled" : "Disabled"}
          ✦» **AUTO RECORDING:** ${
            config.AUTORECORDING ? "Enabled" : "Disabled"
          }
      
          --- Thank you for using **© SITHIJA-MD 𝗑ᴾᴿᴼ 💚**. 
          We're here to make your experience enjoyable and seamless. 
          If you need any help or have questions, don't hesitate to ask. 
          
          **Enjoy your time with us!** 😊`;

      try {
        await conn.sendMessage(conn.user.id, {
          text: up,
          contextInfo: {
            mentionedJid: ["94717775628@s.whatsapp.net"],
            groupMentions: [],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363299978149557@newsletter",
              newsletterName: "© SITHIJA-MD 𝗑ᴾᴿᴼ 💚",
              serverMessageId: 999,
            },
            externalAdReply: {
              title: "© SITHIJA-MD 𝗑ᴾᴿᴼ 💚",
              body: " ©𝐌𝐑 𝐑𝐀𝐒𝐇𝐌𝐈𝐊𝐀 𝐎𝐅𝐂 💚",
              mediaType: 1,
              sourceUrl: "https://github.com/Mrrashmika",
              thumbnailUrl:
                "https://raw.githubusercontent.com/RASH-DATA/ANJU-DATA/refs/heads/main/LOGOS/6152181515400889311.jpg",
              renderLargerThumbnail: false,
              showAdAttribution: true,
            },
          },
        });
      } catch (msgErr) {
        console.error("❌ Error sending welcome message:", msgErr);
      }
    }
  });

  //============================================================================
  const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
  } = require("./src/utils/functions");
  const { sms, downloadMediaMessage } = require("./src/utils/msg");
  //==========================================================================

  conn.ev.on("messages.upsert", async (mek) => {
    if (
      config.ALLWAYSONLINE === false &&
      mek.key &&
      mek.key.remoteJid !== "status@broadcast"
    ) {
      await conn.readMessages([mek.key]);
    }
    
    mek = mek.messages;
    if (!mek.message) return;
    
    mek.message =
      getContentType(mek.message) === "ephemeralMessage"
        ? mek.message.ephemeralMessage.message
        : mek.message;
      
    if (
      mek.key &&
      mek.key.remoteJid === "status@broadcast" &&
      config.AUTOREADSTATUS === true
    ) {
      const participant = mek.key.participant || mek.key.remoteJid;
      if (!participant) return;

      const botId =
        conn.user && conn.user.id
          ? conn.user.id.split(":") + "@s.whatsapp.net"
          : null;
      if (!botId) return;

      try {
        await conn.sendMessage(
          mek.key.remoteJid,
          {
            react: {
              key: mek.key,
              text: `${config.EMOJI}`,
            },
          },
          {
            statusJidList: [participant, botId],
          }
        );
        await conn.readMessages([mek.key]);
      } catch (e) {
        console.error("Error reacting to status:", e);
      }
    }

    const prefix = getPrefix();
    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    
    const quoted =
      type == "extendedTextMessage" &&
      mek.message.extendedTextMessage.contextInfo != null
        ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
        : [];
        
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : type == "interactiveResponseMessage"
        ? mek.message.interactiveResponseMessage &&
          mek.message.interactiveResponseMessage.nativeFlowResponseMessage &&
          JSON.parse(
            mek.message.interactiveResponseMessage.nativeFlowResponseMessage
              .paramsJson
          ) &&
          JSON.parse(
            mek.message.interactiveResponseMessage.nativeFlowResponseMessage
              .paramsJson
          ).id
        : type == "templateButtonReplyMessage"
        ? mek.message.templateButtonReplyMessage &&
          mek.message.templateButtonReplyMessage.selectedId
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : type == "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type == "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : "";
        
    const isCmd = body.startsWith(prefix);
    const command = isCmd
      ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
      : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    
    const sender = mek.key.fromMe
      ? conn.user.id.split(":") + "@s.whatsapp.net" || conn.user.id
      : mek.key.participant || mek.key.remoteJid;
      
    const senderNumber = sender.split("@");
    const botNumber = conn.user.id.split(":");
    const pushname = mek.pushName || "Sin Nombre";
    const isMe = botNumber.includes(senderNumber);
    
    const isOwner =
      ownerNumber.includes(senderNumber) ||
      isMe ||
      (config.SUDO && config.SUDO.includes(senderNumber));
      
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    
    const groupMetadata = isGroup
      ? await conn.groupMetadata(from).catch((e) => {})
      : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? await groupMetadata.participants : "";
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : "";
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    
    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek });
    };
    
    conn.downloadAndSaveMediaMessage = async (
      message,
      filename,
      appendExtension = true
    ) => {
      let messageContent = message.msg ? message.msg : message;
      let mimeType = (message.msg || message).mimetype || "";
      let mediaType = message.mtype
        ? message.mtype.replace(/Message/gi, "")
        : mimeType.split("/");

      const mediaStream = await downloadContentFromMessage(
        messageContent,
        mediaType
      );

      let mediaBuffer = Buffer.from([]);
      for await
