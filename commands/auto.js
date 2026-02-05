const {
  addJob,
  handleYouTube,
  handleAPI
} = require("../lib/downloader");

module.exports = {
  name:"auto",

  execute: async(sock,m,args)=>{

    const text = m.body || "";
    const url =
      text.match(/https?:\/\/\S+/);

    if(!url) return;

    const link = url[0];

    await m.reply("📥 Added to queue...");

    addJob(sock,{
      run: async()=>{

        if(link.includes("youtu"))
          return handleYouTube(sock,m,link);

        if(
          link.includes("tiktok") ||
          link.includes("instagram") ||
          link.includes("linkedin")
        )
          return handleAPI(sock,m,link);

        m.reply("❌ Unsupported link");

      }
    });
  }
};
