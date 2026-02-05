module.exports = {
  name: "detect",

  execute: async (sock, m) => {

    const jid = m.chat;

    let type = "Private Chat";

    if (jid.endsWith("@g.us"))
      type = "Group";

    if (jid.endsWith("@newsletter"))
      type = "Channel";

    const text = `🔍 *JID DETECTED*

📌 Type: ${type}
🆔 JID: ${jid}
`;

    // send to chat
    await sock.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    );

    // print in console
    console.log("===== JID DETECT =====");
    console.log("TYPE:", type);
    console.log("JID:", jid);
    console.log("======================");
  }
};
