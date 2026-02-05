// Pro Bot Menu Command
const config = require("../config");

module.exports = {
  name: "menu",

  execute: async (sock, m) => {

    const p = config.PREFIX;

    const menuText = `
╭━━〔 🤖 ${config.BOT_NAME} 〕━━⬣
┃ 👤 Owner: ${config.OWNER_NAME || "Jeffrey"}
┃ ⚙️ Mode: Public
┃ 👻 Ghost: ${config.GHOST_MODE ? "ON" : "OFF"}
┃ 🚀 Version: ${config.BOT_VERSION || "1.0"}
╰━━━━━━━━━━━━━━⬣

🤖 *AI*
${p}ai <text>

📥 *DOWNLOAD*
${p}ytmp3 <url>
${p}ytmp4 <url>
${p}tiktok <url>
${p}insta <url>
${p}linkedin <url>
${p}playlist <url>
${p}spotify <url>
${p}yt <url>

🎮 *FUN*
${p}ping
${p}tagall
${p}react
${p}tag

👥 *GROUP*
${p}kick
${p}promote
${p}demote
${p}welcome on/off
${p}antidelete on/off

🛒 *SALES*
Buy Data
Shop
Inquiry

⚙️ *SYSTEM*
${p}menu
${p}creator
${p}ghost on/off
${p}vo 
${p}set
${p}getconfig <text>
${p}pair <number>

👑 *OWNER*
${p}join <link>
${p}leave
${p}block
${p}unblock
${p}storemode <on|off>
${p}setbanner <url|on|off>

━━━━━━━━━━━━━━
✨ Tap a button below
`;

    await sock.sendMessage(
      m.chat,
      {
        image: { url: config.MENU_IMAGE },

        caption: menuText,
        footer: config.BOT_FOOTER || "Powered by Bot",

        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: "👥 Join Group",
              url: config.GROUP_LINK
            }
          },
          {
            index: 2,
            urlButton: {
              displayText: "📢 Channel",
              url: config.CHANNEL_LINK
            }
          },
          {
            index: 3,
            quickReplyButton: {
              displayText: "📜 Refresh",
              id: p + "menu"
            }
          }
        ]
      },
      { quoted: m }
    );

  }
};
