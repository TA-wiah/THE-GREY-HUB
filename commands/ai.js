const axios = require("axios");

// simple cooldown map
const cooldown = new Map();

// small memory per user
const memory = new Map();

module.exports = {
  name: "ai",

  execute: async (sock, m, args) => {

    if (!args.length)
      return m.reply("🤖 Ask me something.");

    const user = m.sender;

    // ===== COOLDOWN (5s) =====
    if (cooldown.has(user)) {
      const left =
        5 - ((Date.now() - cooldown.get(user)) / 1000);

      if (left > 0)
        return m.reply(
          `⏳ Wait ${left.toFixed(1)}s`
        );
    }

    cooldown.set(user, Date.now());

    const question =
      args.join(" ");

    // ===== TYPING INDICATOR =====
    await sock.sendPresenceUpdate(
      "composing",
      m.chat
    );

    // ===== MEMORY =====
    let history =
      memory.get(user) || [];

    history.push(question);

    if (history.length > 5)
      history.shift();

    memory.set(user, history);

    try {

      const res =
        await axios.get(
          "https://api.popcat.xyz/chatbot",
          {
            params:{
              msg:question,
              owner:"Jeffrey",
              botname:"SalesBot"
            }
          }
        );

      let reply =
        res.data.response;

      if (!reply)
        reply =
          "Hmm… I have no words 😅";

      await sock.sendPresenceUpdate(
        "paused",
        m.chat
      );

      m.reply(`🤖 ${reply}`);

    } catch (e) {

      m.reply(
        "⚠️ AI servers busy.\nTry again later."
      );
    }

  }
};
