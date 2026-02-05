let antilinkOn = false;

module.exports = {
  name:"antilink",

  execute: async(sock,m,args)=>{

    if(args[0]==="on"){
      antilinkOn = true;
      return m.reply("✅ Anti-link ON");
    }

    if(args[0]==="off"){
      antilinkOn = false;
      return m.reply("❌ Anti-link OFF");
    }

    m.reply(".antilink on/off");
  },

  check: async(sock,m)=>{

    if(!antilinkOn || !m.isGroup)
      return;

    if(m.body.includes("chat.whatsapp.com")){
      await sock.sendMessage(
        m.chat,
        { text:"🚫 Link detected!" }
      );
    }
  }
};
