module.exports = {
  name: "tagall",

  execute: async (sock, m, args) => {

    if (!m.isGroup)
      return m.reply("❌ Group only");

    const meta =
      await sock.groupMetadata(m.chat);

    // Admin check (recommended)
    const admins =
      meta.participants
      .filter(p=>p.admin)
      .map(p=>p.id);

    if(!admins.includes(m.sender))
      return m.reply("❌ Admin only");

    const participants =
      meta.participants.map(p=>p.id);

    const emojis = [
      "🔥","🌟","⚡","💎","🚀",
      "🎯","🎉","🍀","⭐","🧩"
    ];

    const groupName = meta.subject;

    // ===== HEADER =====
    let text = `
╭━━━〔 📢 Announcement 〕━━━⬣
┃ 🏷️ ${groupName}
┃ 👥 ${participants.length} Members
╰━━━━━━━━━━━━━━⬣
`;

    // ===== MESSAGE FIRST =====
    if(args.length){
      text += `\n💬 *Message:*\n${args.join(" ")}\n`;
    }

    text += `\n━━━━━━━━━━━━━━⬣\n`;

    // ===== TAG LIST =====
    participants.forEach(u=>{
      const emoji =
        emojis[Math.floor(
          Math.random()*emojis.length
        )];

      text += `${emoji} @${u.split("@")[0]}\n`;
    });

    await sock.sendMessage(
      m.chat,
      {
        text,
        mentions: participants
      },
      { quoted:m }
    );
  }
};
