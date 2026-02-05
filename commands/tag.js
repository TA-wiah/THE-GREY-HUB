module.exports = {
  name: "tag",

  execute: async (sock, m, args) => {

    if(!m.isGroup)
      return m.reply("❌ Group only");

    const meta =
      await sock.groupMetadata(m.chat);

    // ===== ADMIN CHECK =====
    const admins =
      meta.participants
        .filter(p=>p.admin)
        .map(p=>p.id);

    if(!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    // ===== TARGET USER =====
    let user =
      m.mentionedJid?.[0] ||
      m.quoted?.sender;

    if(!user)
      return m.reply(
        "❌ Tag or reply to a user"
      );

    const emojis = [
      "🔥","👀","⚡","💬",
      "📢","🚀","🎯","✨"
    ];

    const emoji =
      emojis[
        Math.floor(
          Math.random()*emojis.length
        )
      ];

    const message =
      args.join(" ") ||
      "You were mentioned!";

    await sock.sendMessage(
      m.chat,
      {
        text:
`${emoji} @${user.split("@")[0]}

${message}`,
        mentions:[user]
      },
      { quoted:m }
    );
  }
};
