module.exports = {
  name:"linkedin",

  execute: async(sock,m,args)=>{

    if(!args[0])
      return m.reply("Send LinkedIn link");

    const res =
      await axios.get(
`https://api.tiklydown.eu.org/api/download?url=${args[0]}`
      );

    await sock.sendMessage(
      m.chat,
      {
        video:{
          url:res.data.video.noWatermark
        }
      },
      { quoted:m }
    );
  }
};
