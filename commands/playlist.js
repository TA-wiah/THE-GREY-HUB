const ytpl = require("ytpl");

module.exports = {
  name:"playlist",

  execute: async(sock,m,args)=>{

    if(!args[0])
      return m.reply("Send playlist link");

    const list =
      await ytpl(args[0]);

    let text =
`📀 Playlist: ${list.title}

Videos:
`;

    list.items
      .slice(0,10)
      .forEach((v,i)=>{
        text += `${i+1}. ${v.title}\n`;
      });

    m.reply(text);
  }
};
