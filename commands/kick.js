// ===== KICK COMMAND =====
module.exports = {
  name: "kick",

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

    // Get user to kick - either mentioned or replied
    let userToKick = [];

    const mention =
      m.message?.extendedTextMessage
        ?.contextInfo?.mentionedJid;

    if (mention && mention.length > 0) {
      userToKick = mention;
    }
    else if (m.quoted && m.quoted.sender) {
      userToKick = [m.quoted.sender];
    }
    else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
      userToKick = [m.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToKick.length === 0) {
      return m.reply(
        "❌ Tag user or reply to their message!\n\n" +
        "Usage:\n" +
        "• `.kick @user`\n" +
        "• Reply to a message with `.kick`"
      );
    }

    // Prevent kicking bot owner or other admins
    const isAdmin = userToKick.some(jid => admins.includes(jid));
    if (isAdmin) {
      return m.reply("❌ Cannot kick admins!");
    }

    try {
      await sock.groupParticipantsUpdate(
        m.chat,
        userToKick,
        "remove"
      );

      const usernames = userToKick.map(jid => {
        const jidString = typeof jid === 'string' ? jid : (jid.id || jid.toString());
        return `@${jidString.split('@')[0]}`;
      });

      const kickMessage = 
        `*『 USER REMOVED 』*\n\n` +
        `👢 *Kicked User${userToKick.length > 1 ? 's' : ''}:*\n` +
        `${usernames.map(name => `• ${name}`).join('\n')}\n\n` +
        `👮 *Kicked By:* @${m.sender.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;

      await sock.sendMessage(
        m.chat,
        {
          text: kickMessage,
          mentions: [m.sender] // Don't mention kicked users
        },
        { quoted: m }
      );

    } catch (error) {
      console.error('Kick Error:', error);
      return m.reply(
        "❌ Failed to kick user!\n\n" +
        "Possible reasons:\n" +
        "• User not in group\n" +
        "• Bot lacks permissions\n" +
        "• Cannot remove group creator"
      );
    }
  }
};