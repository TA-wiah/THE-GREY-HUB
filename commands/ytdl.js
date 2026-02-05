const ytdl = require("ytdl-core");
const fs = require("fs");

module.exports = {
  name: "yt",

  execute: async (sock, m, args) => {

    if (!args[0])
      return m.reply("❌ Send YouTube link");

    if (!ytdl.validateURL(args[0]))
      return m.reply("❌ Invalid YouTube URL");

    try {

      await m.reply("⏳ Downloading audio...");

      const info =
        await ytdl.getInfo(args[0]);

      const title =
        info.videoDetails.title
          .replace(/[^\w\s]/gi,'');

      const size =
        parseInt(
          info.formats[0].contentLength || 0
        ) / 1024 / 1024;

      if (size > 25)
        return m.reply(
          "❌ File too large (25MB limit)"
        );

      const file =
        `./${Date.now()}.mp3`;

      const stream = ytdl(
        args[0],
        { filter:"audioonly", quality:"highestaudio" }
      );

      stream.pipe(
        fs.createWriteStream(file)
      );

      stream.on("end", async ()=>{

        await sock.sendMessage(
          m.chat,
          {
            audio:
              fs.readFileSync(file),
            mimetype:"audio/mpeg",
            fileName: title+".mp3",
            ptt:false
          },
          { quoted:m }
        );

        fs.unlinkSync(file);
      });

      stream.on("error", ()=>{
        m.reply("❌ Download failed");
      });

    } catch (e){
      m.reply("❌ Error occurred");
    }
  }
};
