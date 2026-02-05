// ===== MUTE COMMAND =====
module.exports = {
  name: "mute",

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
        "announcement"
      );

      const muteMessage = 
        `*『 GROUP MUTED 』*\n\n` +
        `🔇 *Status:* Only admins can send messages\n\n` +
        `👮 *Muted By:* @${m.sender.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;

      await sock.sendMessage(
        m.chat,
        {
          text: muteMessage,
          mentions: [m.sender]
        },
        { quoted: m }
      );

    } catch (error) {
      console.error('Mute Error:', error);
      return m.reply("❌ Failed to mute group!");
    }
  }
};