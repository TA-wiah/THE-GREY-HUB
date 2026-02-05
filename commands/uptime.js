const os = require("os");
const config = require("../config");
const uptime =
  formatTime((Date.now() - global.botStartTime)/1000);

function formatTime(sec){
  sec = Number(sec);

  const d = Math.floor(sec / 86400);
  const h = Math.floor(sec % 86400 / 3600);
  const m = Math.floor(sec % 3600 / 60);
  const s = Math.floor(sec % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = {
  name: "uptime",

  execute: async (sock, m) => {

    const uptime = formatTime(process.uptime());
    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const text = `
╭━━━〔 🤖 BOT STATUS 〕━━━⬣

⏱️ Uptime:
${uptime}

💾 RAM Used:
${mem} MB

🖥️ Platform:
${os.platform()}

👑 Owner:
${config.OWNER_NAME}

⚡ Mode:
${config.GHOST_MODE ? "Ghost" : "Public"}

╰━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(
      m.chat,
      {
        text,
        footer: config.BOT_FOOTER || "System Panel",

        templateButtons: [
          {
            index: 1,
            quickReplyButton:{
              displayText:"🔄 Refresh",
              id: config.PREFIX + "uptime"
            }
          },
          {
            index: 2,
            quickReplyButton:{
              displayText:"📋 Menu",
              id: config.PREFIX + "menu"
            }
          }
        ]
      },
      { quoted: m }
    );

  }
};
// module.exports = {
//   name: "uptime",