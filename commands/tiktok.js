const axios = require("axios");

module.exports = {
  name:"tiktok",

  execute: async(sock,m,args)=>{

    if(!args[0])
      return m.reply("Send TikTok link");

    const res =
      await axios.get(
`https://api.tiklydown.eu.org/api/download?url=${args[0]}`
      );

    await sock.sendMessage(
      m.chat,
      {
        video:{
          url:res.data.video.noWatermark
        },
        caption:"✅ TikTok Downloaded"
      },
      { quoted:m }
    );
  }
};
