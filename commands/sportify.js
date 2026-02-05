module.exports = {
  name:"spotify",

  execute: async(sock,m,args)=>{

    if(!args[0])
      return m.reply("Send Spotify link");

    const res =
      await axios.get(
`https://api.neoxr.eu/api/spotify?url=${args[0]}&apikey=free`
      );

    await sock.sendMessage(
      m.chat,
      {
        audio:{
          url:res.data.data.url
        },
        mimetype:"audio/mpeg"
      },
      { quoted:m }
    );
  }
};
