const fs = require("fs");
const {
  downloadContentFromMessage,
  getContentType,
  proto
} = require("@whiskeysockets/baileys");


// ==============================
// DOWNLOAD MEDIA
// ==============================
const downloadMediaMessage = async (m, filename = "file") => {
  let mimeMap = {
    imageMessage: "image",
    videoMessage: "video",
    audioMessage: "audio",
    stickerMessage: "sticker",
    documentMessage: "document"
  };

  if (m.type === "viewOnceMessage") {
    m.type = getContentType(m.msg);
    m.msg = m.msg[m.type];
  }

  if (!mimeMap[m.type]) return null;

  const stream = await downloadContentFromMessage(
    m.msg,
    mimeMap[m.type]
  );

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  let ext = {
    imageMessage: ".jpg",
    videoMessage: ".mp4",
    audioMessage: ".mp3",
    stickerMessage: ".webp",
    documentMessage: ""
  };

  let file = filename + (ext[m.type] || "");
  fs.writeFileSync(file, buffer);

  return buffer;
};


// ==============================
// AUTO REACT HELPER
// ==============================
const autoReact = async (conn, m, emoji = "🤖") => {
  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: m.key
      }
    });
  } catch {}
};


// ==============================
// VIEW-ONCE EXTRACTOR
// ==============================
const openViewOnce = async (conn, m) => {
  if (!m.message?.viewOnceMessage) return null;

  const msg =
    m.message.viewOnceMessage.message;

  const type = getContentType(msg);

  const media = msg[type];

  const stream = await downloadContentFromMessage(
    media,
    type.replace("Message", "")
  );

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  return { buffer, type };
};


// ==============================
// MESSAGE SERIALIZER
// ==============================
const sms = (conn, m) => {
  if (!m.message) return m;

  m.type = getContentType(m.message);
  m.msg = m.message[m.type];
  m.chat = m.key.remoteJid;
  m.fromMe = m.key.fromMe;
  m.sender = m.fromMe
    ? conn.user.id.split(":")[0] + "@s.whatsapp.net"
    : m.key.participant || m.chat;

  m.body =
    m.message.conversation ||
    m.msg?.text ||
    m.msg?.caption ||
    "";

  // reply helper
  m.reply = async (text) => {
    await autoReact(conn, m); // auto react when replying
    return conn.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    );
  };

  // download helper
  m.download = (filename) =>
    downloadMediaMessage(m, filename);

  return m;
};


// ==============================
// RANDOM ID
// ==============================
function makeid(num = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < num; i++) {
    res += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }
  return res;
}


module.exports = {
  sms,
  downloadMediaMessage,
  openViewOnce,
  autoReact,
  makeid
};
// ==============================
// END OF FILE
// ==============================