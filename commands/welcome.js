// ===== WELCOME COMMAND =====
const { db, save } = require("../database");

module.exports = {
  name: "welcome",

  execute: async (sock, m, args) => {

    if (!m.isGroup)
      return m.reply("❌ Group only command");

    const meta =
      await sock.groupMetadata(m.chat);

    const admins =
      meta.participants
        .filter(p => p.admin)
        .map(p => p.id);

    // Only admins can toggle welcome
    if (!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    const g = m.chat;

    // Initialize group data with defaults
    db.groups[g] ??= {
      welcome: false,
      text: "Welcome @user to {group}! 🎉",
      bye: "Goodbye @user! We'll miss you 😢"
    };

    // Show status if no argument
    if (!args.length) {
      const status = db.groups[g].welcome ? "✅ ON" : "❌ OFF";
      return m.reply(
        `*『 WELCOME SETTINGS 』*\n\n` +
        `*Status:* ${status}\n\n` +
        `*Welcome Message:*\n${db.groups[g].text}\n\n` +
        `*Goodbye Message:*\n${db.groups[g].bye}\n\n` +
        `*Usage:*\n` +
        `• \`.welcome on\` - Enable\n` +
        `• \`.welcome off\` - Disable\n` +
        `• \`.setwelcome <text>\` - Set welcome\n` +
        `• \`.setbye <text>\` - Set goodbye`
      );
    }

    // Toggle ON
    if (args[0].toLowerCase() === "on") {
      db.groups[g].welcome = true;
      save();
      return m.reply(
        `✅ *Welcome messages enabled!*\n\n` +
        `*Welcome:* ${db.groups[g].text}\n` +
        `*Goodbye:* ${db.groups[g].bye}\n\n` +
        `💡 Customize with \`.setwelcome\` and \`.setbye\``
      );
    }

    // Toggle OFF
    if (args[0].toLowerCase() === "off") {
      db.groups[g].welcome = false;
      save();
      return m.reply("❌ *Welcome messages disabled*");
    }

    // Invalid argument
    m.reply(
      "❌ Invalid option!\n\n" +
      "*Usage:*\n" +
      "• `.welcome on` - Enable\n" +
      "• `.welcome off` - Disable\n" +
      "• `.welcome` - Show status"
    );
  }
};