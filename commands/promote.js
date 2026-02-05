module.exports = {
  name: "promote",

  execute: async (sock, m) => {

    // Must be group
    if (!m.isGroup)
      return m.reply("❌ Group only command");

    // Get group metadata
    const meta =
      await sock.groupMetadata(m.chat);

    const admins =
      meta.participants
        .filter(p => p.admin)
        .map(p => p.id);

    // Bot must be admin
    if (!admins.includes(sock.user.id))
      return m.reply("❌ I must be admin");

    // Sender must be admin
    if (!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    // Get user to promote - either mentioned or replied
    let userToPromote = [];

    // Check for mentioned users
    const mention =
      m.message?.extendedTextMessage
        ?.contextInfo?.mentionedJid;

    if (mention && mention.length > 0) {
      userToPromote = mention;
    }
    // Check for replied message
    else if (m.quoted && m.quoted.sender) {
      userToPromote = [m.quoted.sender];
    }
    // Alternative check for replied participant
    else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
      userToPromote = [m.message.extendedTextMessage.contextInfo.participant];
    }

    // If no user found
    if (userToPromote.length === 0) {
      return m.reply(
        "❌ Tag user or reply to their message to promote!\n\n" +
        "Usage:\n" +
        "• `.promote @user`\n" +
        "• Reply to a message with `.promote`"
      );
    }

    try {
      // Promote user(s)
      await sock.groupParticipantsUpdate(
        m.chat,
        userToPromote,
        "promote"
      );

      // Get usernames for promoted users
      const usernames = userToPromote.map(jid => {
        const jidString = typeof jid === 'string' ? jid : (jid.id || jid.toString());
        return `@${jidString.split('@')[0]}`;
      });

      // Prepare mentions list
      const mentionList = [...userToPromote, m.sender];

      // Send promotion announcement
      const promotionMessage = 
        `*『 GROUP PROMOTION 』*\n\n` +
        `👥 *Promoted User${userToPromote.length > 1 ? 's' : ''}:*\n` +
        `${usernames.map(name => `• ${name}`).join('\n')}\n\n` +
        `👑 *Promoted By:* @${m.sender.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;

      await sock.sendMessage(
        m.chat,
        {
          text: promotionMessage,
          mentions: mentionList
        },
        { quoted: m }
      );

    } catch (error) {
      console.error('Promote Error:', error);
      return m.reply(
        "❌ Failed to promote user!\n\n" +
        "Possible reasons:\n" +
        "• User is already admin\n" +
        "• User not in group\n" +
        "• Bot lacks permissions"
      );
    }
  }
};
// ```

// **Key fixes:**

// 1. **Multiple user detection methods:**
//    - Checks for `@mentioned` users first
//    - Falls back to `m.quoted.sender` (your message structure)
//    - Also checks `contextInfo.participant` as backup

// 2. **Better error handling:**
//    - Clear usage instructions
//    - Detailed error messages
//    - Try-catch for promotion action

// 3. **Proper mentions:**
//    - Includes both promoted users and promoter in mentions
//    - Handles JID string conversion safely

// 4. **Enhanced feedback:**
//    - Beautiful promotion announcement
//    - Shows who promoted whom
//    - Timestamp included

// **Usage:**
// ```