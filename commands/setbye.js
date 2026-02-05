// ===== SETBYE COMMAND =====
const { db, save } = require("../database");

module.exports = {
  name: "setbye",

  execute: async (sock, m, args) => {

    if (!m.isGroup)
      return m.reply("❌ Group only command");

    const meta =
      await sock.groupMetadata(m.chat);

    const admins =
      meta.participants
        .filter(p => p.admin)
        .map(p => p.id);

    // Only admins can set goodbye message
    if (!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    const g = m.chat;

    if (!args.length) {
      return m.reply(
        "❌ Provide goodbye message!\n\n" +
        "*Usage:*\n" +
        "`.setbye <message>`\n\n" +
        "*Variables:*\n" +
        "• `@user` - mentions the user\n" +
        "• `{name}` - user's name\n" +
        "• `{group}` - group name\n\n" +
        "*Example:*\n" +
        "`.setbye Goodbye @user! We'll miss you 😢`"
      );
    }

    // Initialize group data
    db.groups[g] ??= {
      welcome: false,
      text: "Welcome @user 🎉",
      bye: "Goodbye @user 😢"
    };

    // Save goodbye message
    db.groups[g].bye = args.join(" ");
    save();

    // Preview the message
    const preview = args.join(" ")
      .replace(/@user/g, `@${m.sender.split('@')[0]}`)
      .replace(/{name}/g, m.pushName || "User")
      .replace(/{group}/g, meta.subject);

    await sock.sendMessage(
      m.chat,
      {
        text: 
          `✅ *Goodbye message saved!*\n\n` +
          `*Preview:*\n${preview}\n\n` +
          `💡 Enable with: \`.welcome on\``,
        mentions: [m.sender]
      },
      { quoted: m }
    );
  }
};