module.exports = {
  name: "ping",

  execute: async (sock, m) => {

    const start = Date.now();

    const msg = await sock.sendMessage(
      m.chat,
      { text: "🏓 Pinging..." },
      { quoted: m }
    );

    const end = Date.now();

    const latency = end - start;

    await sock.sendMessage(
      m.chat,
      {
        text:
`🏓 *PONG!*

⚡ Speed: ${latency} ms
🤖 Status: Online`
      },
      { quoted: msg }
    );
  }
};
