const ytdl = require("ytdl-core");

module.exports = {
  name: "ytmp4",

  execute: async (sock,m,args)=>{

    if(!args[0])
      return m.reply("Send YouTube link");

    if(!ytdl.validateURL(args[0]))
      return m.reply("Invalid URL");

    await m.reply("⏳ Downloading video...");

    const info =
      await ytdl.getInfo(args[0]);

    const title =
      info.videoDetails.title;

    const thumb =
      info.videoDetails.thumbnails.pop().url;

    const duration =
      info.videoDetails.lengthSeconds;

    await sock.sendMessage(
      m.chat,
      {
        video:{
          url: args[0]
        },
        caption:
`🎬 ${title}
⏱️ Duration: ${duration}s`
      },
      { quoted:m }
    );
  }
};
