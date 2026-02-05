// ===== UNMUTE COMMAND =====
module.exports = {
  name: "unmute",

  execute: async (sock, m) => {

    if (!m.isGroup)
      return m.reply("❌ Group only command");

    const meta =
      await sock.groupMetadata(m.chat);

    const admins =
      meta.participants
        .filter(p => p.admin)
        .map(p => p.id);

    if (!admins.includes(sock.user.id))
      return m.reply("❌ I must be admin");

    if (!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    try {
      await sock.groupSettingUpdate(
        m.chat,
        "not_announcement"
      );

      const unmuteMessage = 
        `*『 GROUP UNMUTED 』*\n\n` +
        `🔊 *Status:* All members can send messages\n\n` +
        `👮 *Unmuted By:* @${m.sender.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;

      await sock.sendMessage(
        m.chat,
        {
          text: unmuteMessage,
          mentions: [m.sender]
        },
        { quoted: m }
      );

    } catch (error) {
      console.error('Unmute Error:', error);
      return m.reply("❌ Failed to unmute group!");
    }
  }
};