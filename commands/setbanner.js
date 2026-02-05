// ===== SETBANNER COMMAND =====
const { db, save } = require("../database");

module.exports = {
  name: "setbanner",

  execute: async (sock, m, args) => {

    if (!m.isGroup)
      return m.reply("❌ Group only command");

    const meta = await sock.groupMetadata(m.chat);

    const admins =
      meta.participants
        .filter(p => p.admin)
        .map(p => p.id);

    if (!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    const g = m.chat;

    // Initialize group data
    db.groups[g] ??= {
      welcome: false,
      text: "Welcome @user to {group}! 🎉",
      bye: "Goodbye @user! 😢",
      banner: "https://files.catbox.moe/bthftj.png",
      welcomeImage: true
    };

    // Check if user wants to disable image
    if (args[0]?.toLowerCase() === "off") {
      db.groups[g].welcomeImage = false;
      save();
      return m.reply("❌ *Welcome banner disabled*\n\nText-only messages will be sent.");
    }

    // Check if user wants to enable image
    if (args[0]?.toLowerCase() === "on") {
      db.groups[g].welcomeImage = true;
      save();
      return m.reply("✅ *Welcome banner enabled*");
    }

    // Set custom banner URL
    if (!args.length) {
      return m.reply(
        "❌ Provide banner URL!\n\n" +
        "*Usage:*\n" +
        "• `.setbanner <url>` - Set custom image\n" +
        "• `.setbanner off` - Disable image (text only)\n" +
        "• `.setbanner on` - Enable image\n\n" +
        "*Current banner:*\n" +
        (db.groups[g].banner || "Default")
      );
    }

    const url = args[0];

    // Basic URL validation
    if (!url.startsWith("http")) {
      return m.reply("❌ Invalid URL! Must start with http:// or https://");
    }

    // Save banner
    db.groups[g].banner = url;
    db.groups[g].welcomeImage = true;
    save();

    // Send preview
    try {
      await sock.sendMessage(
        m.chat,
        {
          image: { url },
          caption: 
            `✅ *Welcome banner updated!*\n\n` +
            `*Preview above* ⬆️\n\n` +
            `This will be used for welcome/goodbye messages.`
        },
        { quoted: m }
      );
    } catch (error) {
      return m.reply(
        "⚠️ *Banner saved but failed to preview*\n\n" +
        "Make sure the URL is a direct image link!"
      );
    }
  }
};
// ```

// **Key improvements:**

// 1. ✅ **Variable replacement** - Supports `@user`, `{user}`, `{name}`, `{group}`, `{members}`
// 2. ✅ **Custom banner** - Each group can set their own welcome image
// 3. ✅ **Text-only mode** - Option to disable images
// 4. ✅ **Error handling** - Won't crash bot if welcome fails
// 5. ✅ **Console logging** - Track welcome/goodbye events
// 6. ✅ **Flexible defaults** - Uses default text if not customized
// 7. ✅ **Banner preview** - Shows banner when setting it

// **Available variables for welcome/goodbye messages:**
// - `@user` - Mentions the user
// - `{user}` - Alternative mention syntax
// - `{name}` - Username without @
// - `{group}` - Group name
// - `{members}` - Current member count

// **Usage:**
// ```
// .setwelcome Welcome @user to {group}! We now have {members} members! 🎉
// .setbye Goodbye {name}! We'll miss you in {group} 😢
// .setbanner https://example.com/banner.jpg
// .setbanner off (text only)
// .setbanner on (enable image)