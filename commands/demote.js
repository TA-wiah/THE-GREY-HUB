// ===== DEMOTE COMMAND =====
module.exports = {
  name: "demote",

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

    // Get user to demote - either mentioned or replied
    let userToDemote = [];

    const mention =
      m.message?.extendedTextMessage
        ?.contextInfo?.mentionedJid;

    if (mention && mention.length > 0) {
      userToDemote = mention;
    }
    else if (m.quoted && m.quoted.sender) {
      userToDemote = [m.quoted.sender];
    }
    else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
      userToDemote = [m.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToDemote.length === 0) {
      return m.reply(
        "❌ Tag user or reply to their message!\n\n" +
        "Usage:\n" +
        "• `.demote @user`\n" +
        "• Reply to a message with `.demote`"
      );
    }

    try {
      await sock.groupParticipantsUpdate(
        m.chat,
        userToDemote,
        "demote"
      );

      const usernames = userToDemote.map(jid => {
        const jidString = typeof jid === 'string' ? jid : (jid.id || jid.toString());
        return `@${jidString.split('@')[0]}`;
      });

      const mentionList = [...userToDemote, m.sender];

      const demotionMessage = 
        `*『 GROUP DEMOTION 』*\n\n` +
        `👥 *Demoted User${userToDemote.length > 1 ? 's' : ''}:*\n` +
        `${usernames.map(name => `• ${name}`).join('\n')}\n\n` +
        `👮 *Demoted By:* @${m.sender.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;

      await sock.sendMessage(
        m.chat,
        {
          text: demotionMessage,
          mentions: mentionList
        },
        { quoted: m }
      );

    } catch (error) {
      console.error('Demote Error:', error);
      return m.reply(
        "❌ Failed to demote user!\n\n" +
        "Possible reasons:\n" +
        "• User is not admin\n" +
        "• User not in group\n" +
        "• Bot lacks permissions"
      );
    }
  }
};