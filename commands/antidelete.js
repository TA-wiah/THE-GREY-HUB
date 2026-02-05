const config = require("../config");

module.exports = {
  name: "antidelete",

  execute: async (sock,m,args)=>{
    if(m.sender.split("@")[0] !== config.OWNER_NUMBER)
      return m.reply("Owner only.");

    if(args[0]==="on"){
      config.ANTI_DELETE = true;
      m.reply("✅ Anti-delete ON");
    }
    else if(args[0]==="off"){
      config.ANTI_DELETE = false;
      m.reply("❌ Anti-delete OFF");
    }
    else{
      m.reply(".antidelete on/off");
    }
  }
};
