// ===== STOREMODE COMMAND =====
module.exports = {
  name: "storemode",

  execute: async (sock, m, args) => {

    // Only owner can toggle
    if (m.sender !== config.OWNER_NUMBER + "@s.whatsapp.net") {
      return m.reply("❌ Owner only command");
    }

    if (!args.length) {
      const status = config.STORE_MODE === "on" ? "✅ ON" : "❌ OFF";
      return m.reply(
        `*『 STORE MODE 』*\n\n` +
        `*Status:* ${status}\n\n` +
        `*Usage:*\n` +
        `• \`.storemode on\` - Enable\n` +
        `• \`.storemode off\` - Disable`
      );
    }

    if (args[0].toLowerCase() === "on") {
      config.STORE_MODE = "on";
      return m.reply("✅ *Store mode enabled*\n\nGreetings menu is now active.");
    }

    if (args[0].toLowerCase() === "off") {
      config.STORE_MODE = "off";
      return m.reply("❌ *Store mode disabled*\n\nGreetings menu is now inactive.");
    }

    m.reply("❌ Use: `.storemode on` or `.storemode off`");
  }
};