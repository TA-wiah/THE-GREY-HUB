const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "pair",

  execute: async (sock, m, args) => {

    const config = require("../config");

    // ===== OWNER CHECK =====
    const owner =
      config.OWNER_NUMBER + "@s.whatsapp.net";

    if (m.sender !== owner)
      return m.reply("❌ Owner only");

    if (!args[0])
      return m.reply(
        "Example:\n.pair 233xxxxxxxxx"
      );

    // ===== CLEAN NUMBER =====
    const number =
      args[0].replace(/\D/g,"");

    if (number.length < 10)
      return m.reply(
        "❌ Invalid number"
      );

    const sessionPath =
      path.join(
        "./sessions",
        number
      );

    // ===== CREATE FOLDER =====
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(
        sessionPath,
        { recursive:true }
      );
    }

    await m.reply(
      "⏳ Generating pairing code..."
    );

    // ===== AUTH STATE =====
    const {
      state,
      saveCreds
    } =
      await useMultiFileAuthState(
        sessionPath
      );

    const { version } =
      await fetchLatestBaileysVersion();

    const tempSock =
      makeWASocket({
        version,
        auth: state,
        logger: P({ level:"silent" }),
        browser:["GhostSlayer","Chrome","1.0"]
      });

    tempSock.ev.on(
      "creds.update",
      saveCreds
    );

    // ===== REQUEST CODE =====
    setTimeout(async () => {

      try {

        const code =
          await tempSock
            .requestPairingCode(
              number
            );

        await m.reply(
`✅ Pairing Code:

${code}

📱 Open WhatsApp
Linked Devices → Link with code

⏳ Expires in 60 seconds`
        );

      } catch (e) {

        await m.reply(
          "❌ Failed: " +
          e.message
        );

      }

    }, 3000);

    // ===== AUTO CLOSE SOCKET =====
    setTimeout(() => {
      try {
        tempSock.ws.close();
      } catch {}
    }, 60000);

  }
};
