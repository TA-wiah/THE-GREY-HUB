const config = require("../config");

module.exports = {
  name:"ghost",

  execute: async(sock,m,args)=>{

    if(m.sender.split("@")[0] !== config.OWNER_NUMBER)
      return m.reply("Owner only");

    if(args[0]==="on"){
      config.GHOST_MODE = true;
      m.reply("👻 Ghost mode ON");
    }
    else if(args[0]==="off"){
      config.GHOST_MODE = false;
      m.reply("👀 Ghost mode OFF");
    }
    else{
      m.reply(".ghost on/off");
    }
  }
};
