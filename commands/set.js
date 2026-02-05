const fs = require("fs");

const configPath = "./config.js";

// HARD CODED CREATOR
const CREATOR = "233547838433@s.whatsapp.net";

module.exports = {
  name:"set",

  execute: async(sock,m,args)=>{

    delete require.cache[
      require.resolve("../config")
    ];

    const config =
      require("../config");

    // ===== OWNER CHECK =====
    const allowed = [
      config.OWNER_NUMBER + "@s.whatsapp.net",
      CREATOR
    ];

    if(!allowed.includes(m.sender))
      return m.reply("❌ Owner only");

    if(args.length<2){
      return m.reply(
`⚙️ Usage:

.set prefix !
.set data_link https://site.com
.set auto_typing true
.set auto_recording false
.set ghost_mode false
.set anti_delete true`

      );
    }

    const key =
      args[0].toUpperCase();

    const value =
      args.slice(1).join(" ");

    let file =
      fs.readFileSync(
        configPath,"utf8"
      );

    const regex =
      new RegExp(
        `${key}:\\s*.*`,
        "i"
      );

    let newValue =
      `"${value}"`;

    if(
      value==="true"||
      value==="false"
    ){
      newValue=value;
    }

    file=file.replace(
      regex,
      `${key}: ${newValue},`
    );

    fs.writeFileSync(
      configPath,file
    );

    // ===== LIVE REFRESH =====
    delete require.cache[
      require.resolve("../config")
    ];

    m.reply(
`✅ ${key} updated to:

${value}

♻️ Applied instantly.`
    );

  }
};
