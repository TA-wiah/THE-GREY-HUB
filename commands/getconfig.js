module.exports = {
  name:"getconfig",

  execute: async(sock,m)=>{

    delete require.cache[
      require.resolve("../config")
    ];

    const config =
      require("../config");

    const text =
`⚙️ CURRENT CONFIG

Prefix:
${config.PREFIX}

Store:
${config.STORE_NAME}

Auto Typing:
${config.AUTO_TYPING}

Auto Recording:
${config.AUTO_RECORDING}

Anti Delete:
${config.ANTI_DELETE}

Data Link:
${config.DATA_LINK}

Shop Link:
${config.SHOP_LINK}
`;

    m.reply(text);

  }
};
