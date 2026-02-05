const fs = require("fs");
const P = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  getContentType,
  DisconnectReason
} = require("@whiskeysockets/baileys");

let channelSent = false;

const config = require("./config");
const { sms, openViewOnce } = require("./helpers");
const { db, save } = require("./database");
global.botStartTime = Date.now();


setInterval(()=>{
  require("fs").cpSync(
    "./sessions",
    "./sessions_backup",
    { recursive:true }
  );
  console.log("💾 Session backed up");
}, 30 * 60 * 1000); // every 30 mins

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

// ===== LOAD COMMANDS =====
const commands = new Map();
fs.readdirSync("./commands").forEach(file=>{
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
});



// ===== MEMORY STORE (ANTI DELETE) =====
const store = new Map();

async function startBot() {

const { state, saveCreds } =
  await useMultiFileAuthState(
    "./sessions/main"
  );

  const { version } =
    await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,

    logger: P({
      level: "fatal"
    }),

    markOnlineOnConnect:false,
    emitOwnEvents:false,

    browser:["Ubuntu","Chrome","22.04"],
    keepAliveIntervalMs: 10000,
    connectTimeoutMs: 60000
  });

  // ===== SAVE CREDENTIALS =====
  sock.ev.on("creds.update", saveCreds);


  // ===== CONNECTION UPDATE ===== 
  sock.ev.on("connection.update", async (u) => { 

    const { connection, lastDisconnect } = u; 

    console.log("STATUS:", connection); 

    // ========= SAFE PAIRING ========= 
    if ( 
      connection === "connecting" && 
      !sock.authState.creds.registered 
    ) { 
      setTimeout(async () => { 
        try { 
          const code = 
            await sock.requestPairingCode( 
              config.OWNER_NUMBER 
            ); 

          console.log("📲 PAIR CODE:", code); 

        } catch (e) { 
          console.log("❌ Pair error:", e.message); 
        } 
      }, 5000); 
    } 

    // ========= CONNECTED ========= 
    if (connection === "open") { 

      console.log("✅ Connected Successfully"); 

      // ===== SEND SUCCESS MESSAGE ===== 
      await sock.sendMessage( 
        sock.user.id, 
        { 
          text: 
  `✨ *CONNECTED* 
  You are successfully connected to 
  *${config.BOT_NAME}* 🤖 

  Device: ${sock.user.phoneDevice} 
  Device Model: ${sock.user.phoneModel} 
  Device OS: ${sock.user.phoneOs} 
  App Version: ${sock.user.appVersion} 
  Developer: ${config.OWNER_NAME} 
  Status: Online ✅ 
  Mode: Active 🚀 
  Time: ${new Date().toLocaleString()}` 
        } 
      ); 

      // ===== JOIN GROUPS & NEWSLETTERS ===== 
      if (config.GROUP_JIDS?.length) { 

        const groups = [];
        const newsletters = [];

        // Separate groups from newsletters
        config.GROUP_JIDS.forEach(jid => {
          if (jid.includes('@newsletter')) {
            newsletters.push(jid);
          } else {
            groups.push(jid);
          }
        });

        // Join Groups
        for (const jid of groups) { 

          try { 

            await sock.groupMetadata(jid); 

            console.log( 
              "✅ Already in group:", 
              jid 
            ); 

          } catch { 

            try { 
              await sock.groupAcceptInvite( 
                jid.split("@")[0] 
              ); 
              console.log("✅ Joined group:", jid);

            } catch { 
              console.log( 
                "⚠️ Cannot join group:", 
                jid 
              ); 
            } 
          } 
        }

        // Send Newsletter Links (manual join required)
        if (newsletters.length > 0) {
          const newsletterLinks = newsletters
            .map((jid, i) => `${i + 1}️⃣ https://whatsapp.com/channel/${jid.split('@')[0]}`)
            .join('\n');

          await sock.sendMessage(
            sock.user.id,
            {
              text: 
  `📢 *JOIN THESE NEWSLETTERS*

  Please tap the links below to join:

  ${newsletterLinks}

  ⚠️ Newsletters cannot be joined automatically - you must click the link manually.`
            }
          );
        }
      } 

      // ===== CHANNEL REMINDER (PRO) ===== 

      if (!channelSent && config.CHANNEL_LINKS?.length) { 

        channelSent = true; 

        const list = 
          config.CHANNEL_LINKS 
            .map((l,i)=>`${i+1}️⃣ ${l}`) 
            .join("\n"); 

        await sock.sendMessage( 
          sock.user.id, 
          { 
            text: 
      `📢 *OFFICIAL CHANNELS* 

      Stay updated with 
      *${config.BOT_NAME}* 🚀 

      ${list} 

      ━━━━━━━━━━━━━━ 
      Tap a link to join. 

      ⚠️ Auto-join is not supported by WhatsApp.` 
          } 
        ); 
      } 
    } 

    // ========= SMART RECONNECT ========= 
    if (connection === "close") { 

      const reason = 
        lastDisconnect?.error?.output?.statusCode; 

      console.log("❌ Disconnected:", reason); 

      // reconnect only on real drops 
      if ( 
        reason === DisconnectReason.connectionLost || 
        reason === DisconnectReason.timedOut || 
        reason === DisconnectReason.restartRequired 
      ) { 
        console.log("🔄 Smart Reconnect in 5s..."); 
        setTimeout(() => startBot(), 5000); 
      } 

      if (reason === DisconnectReason.loggedOut) { 
        console.log( 
          "❌ Logged out. Delete sessions." 
        ); 
      } 
    } 

  });


  // ===== MAIN HANDLER =====
  sock.ev.on("messages.upsert", async ({messages})=>{

    const raw = messages[0];
    if (!raw.message) return;

    // STORE FOR ANTI DELETE
    if(raw.key?.id){
      store.set(raw.key.id, raw);
    }
    // AUTO READ MODES GHOST MODE
    if(config.AUTO_VIEW_STATUS && !config.GHOST_MODE){
    await sock.readMessages([raw.key]);
    }


    // AUTO STATUS VIEW
    if(raw.key.remoteJid==="status@broadcast"){
      if(config.AUTO_VIEW_STATUS)
        await sock.readMessages([raw.key]);

      if(config.AUTO_LIKE_STATUS){
        await sock.sendMessage(
          "status@broadcast",
          {
            react:{
              key:raw.key,
              text: config.AUTO_LIKE_EMOJI[
                Math.floor(Math.random()*
                config.AUTO_LIKE_EMOJI.length)
              ]
            }
          },
          {statusJidList:[raw.key.participant]}
        );
      }
      return;
    }

    // SERIALIZE
    let m = sms(sock, raw);
    if(!m.body) return;


    // ===== USER TRACKING =====
    db.users ??= {};

    if(m.sender){
      db.users[m.sender] ??= {
        xp:0,
        lastSeen: Date.now()
      };

      db.users[m.sender].xp += 1;
      db.users[m.sender].lastSeen = Date.now();

      save();
    }


    // ===== GLOBAL RANDOM REACT =====
    if(config.AUTO_REACT_EMOJIS?.length){

      const emoji =
        config.AUTO_REACT_EMOJIS[
          Math.floor(
            Math.random() *
            config.AUTO_REACT_EMOJIS.length
          )
        ];

      await sock.sendMessage(
        m.chat,
        {
          react:{
            text: emoji,
            key: raw.key
          }
        }
      );
    }

    // auto detect links
    if(m.body.match(/https?:\/\//)){
      require("./commands/auto")
        .execute(sock,m,[]);
    }
    

    // ===== RUN CHECK HOOKS (antilink etc) =====
    commands.forEach(cmd=>{
      if(cmd.check)
        cmd.check(sock,m);
    });

    let body = m.body.toLowerCase();

    // ===== DATABASE XP =====
    db.users ??= {};
    db.users[m.sender] ??= {xp:0};
    db.users[m.sender].xp += 2;
    save();

    // ===== VIEW ONCE =====
    if(body === config.PREFIX+"vo"){

      if(!m.quoted)
        return m.reply(
          "❌ Reply to a view-once media!"
        );

      // Get the quoted message properly
      const quoted = m.quoted.message || m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if(!quoted)
        return m.reply(
          "❌ Reply to a view-once media!"
        );

      // Check for view-once image
      const quotedImage = quoted?.imageMessage;
      const quotedVideo = quoted?.videoMessage;

      if(quotedImage && quotedImage.viewOnce){
        try {
          // Download image
          const stream = await downloadContentFromMessage(quotedImage, 'image');
          let buffer = Buffer.from([]);
          
          for await(const chunk of stream){
            buffer = Buffer.concat([buffer, chunk]);
          }

          // Send the image
          await sock.sendMessage(
            m.chat,
            { 
              image: buffer, 
              caption: quotedImage.caption || '👁️ View Once Image Revealed',
              fileName: 'viewonce_image.jpg'
            },
            { quoted: m }
          );

          // Auto react
          await sock.sendMessage(
            m.chat,
            {
              react:{
                text:"👁️",
                key: m.key
              }
            }
          );

        } catch(e) {
          console.log("View Once Image Error:", e);
          return m.reply("❌ Failed to download view-once image.");
        }
      } 
      else if(quotedVideo && quotedVideo.viewOnce){
        try {
          // Download video
          const stream = await downloadContentFromMessage(quotedVideo, 'video');
          let buffer = Buffer.from([]);
          
          for await(const chunk of stream){
            buffer = Buffer.concat([buffer, chunk]);
          }

          // Send the video
          await sock.sendMessage(
            m.chat,
            { 
              video: buffer, 
              caption: quotedVideo.caption || '👁️ View Once Video Revealed',
              fileName: 'viewonce_video.mp4'
            },
            { quoted: m }
          );

          // Auto react
          await sock.sendMessage(
            m.chat,
            {
              react:{
                text:"👁️",
                key: m.key
              }
            }
          );

        } catch(e) {
          console.log("View Once Video Error:", e);
          return m.reply("❌ Failed to download view-once video.");
        }
      }
      else {
        return m.reply(
          "⚠️ Not a view-once image or video.\n\n💡 Reply to a view-once media with `.vo`"
        );
      }
    }



    // ===== STORE MODE CHECK =====
    const isStoreMode = config.STORE_MODE !== "off";

    // ===== GREETINGS (NO PREFIX) =====
    if (isStoreMode && config.GREETINGS.includes(body.toLowerCase())) {
      
      // Get user info
      const userName = m.pushName || m.sender.split("@")[0];
      const chatType = m.isGroup ? "Group" : "Private";
      const groupName = m.isGroup 
        ? (await sock.groupMetadata(m.chat)).subject 
        : "Direct Message";

      return m.reply(
        `✨ *Welcome to ${config.SHOP_NAME}* ✨\n\n` +
        `Hello *${userName}*! 👋\n` +
        `We're glad to have you here 😊\n` +
        `How can we help you today?\n\n` +
        `━━━━━━━━━━━━━━\n\n` +
        `1️⃣ 💬 Chat with us\n` +
        `2️⃣ ❓ Make an inquiry\n` +
        `3️⃣ 📶 Buy Data\n` +
        `4️⃣ 🛒 Shop Products\n\n` +
        `━━━━━━━━━━━━━━\n\n` +
        `📌 *Note:*\n` +
        `Reply with a number to continue.\n\n` +
        `Our team is always ready to assist 🙌`
      );
    }

    // ===== OPTION 1: CHAT WITH US =====
    if (isStoreMode && body === "1") {
      
      // Set temporary state to wait for message
      if (!global.awaitingMessage) global.awaitingMessage = {};
      
      global.awaitingMessage[m.sender] = {
        type: "chat",
        timestamp: Date.now()
      };

      return m.reply(
        `💬 *Chat with Us*\n\n` +
        `Please type your message below and we'll get back to you shortly.\n\n` +
        `⏱️ Our team typically responds within 30 minutes.\n\n` +
        `━━━━━━━━━━━━━━\n` +
        `📝 Type your message now...`
      );
    }

    // ===== OPTION 2: MAKE INQUIRY =====
    if (isStoreMode && body === "2") {
      
      // Set temporary state to wait for inquiry
      if (!global.awaitingMessage) global.awaitingMessage = {};
      
      global.awaitingMessage[m.sender] = {
        type: "inquiry",
        timestamp: Date.now()
      };

      return m.reply(
        `❓ *Make an Inquiry*\n\n` +
        `Please describe what you'd like to know about:\n\n` +
        `• Products\n` +
        `• Services\n` +
        `• Pricing\n` +
        `• Availability\n\n` +
        `━━━━━━━━━━━━━━\n` +
        `📝 Type your inquiry now...`
      );
    }

    // ===== HANDLE USER MESSAGE (AFTER SELECTING 1 OR 2) =====
    if (
      isStoreMode && 
      global.awaitingMessage?.[m.sender] && 
      !config.GREETINGS.includes(body.toLowerCase()) &&
      !["1", "2", "3", "4"].includes(body)
    ) {
      
      const waitData = global.awaitingMessage[m.sender];
      
      // Check if message is within 10 minutes
      const timeElapsed = Date.now() - waitData.timestamp;
      if (timeElapsed > 600000) { // 10 minutes
        delete global.awaitingMessage[m.sender];
        return m.reply(
          "⏱️ *Session expired*\n\n" +
          "Please start again by typing a greeting."
        );
      }

      const owner = config.OWNER_NUMBER + "@s.whatsapp.net";
      const userName = m.pushName || "Unknown";
      const userNumber = m.sender.split("@")[0];
      const chatType = m.isGroup ? "Group" : "Private Chat";
      const groupName = m.isGroup 
        ? (await sock.groupMetadata(m.chat)).subject 
        : "Direct Message";

      // Send to owner with full context
      await sock.sendMessage(
        owner,
        {
          text:
    `📩 *NEW ${waitData.type.toUpperCase()}*

    👤 *Customer Info:*
    - Name: ${userName}
    - Number: +${userNumber}
    - JID: ${m.sender}

    📍 *Source:*
    - Type: ${chatType}
    - From: ${groupName}

    📝 *${waitData.type === "chat" ? "Message" : "Inquiry"}:*
    ${body}

    ━━━━━━━━━━━━━━
    ⏰ Received: ${new Date().toLocaleString()}`,
          mentions: [m.sender]
        }
      );

      // Send forwarded message for context
      if (m.message) {
        await sock.sendMessage(
          owner,
          { forward: m },
          { quoted: m }
        );
      }

      // Clear awaiting state
      delete global.awaitingMessage[m.sender];

      // Reply to customer
      return m.reply(
        `✅ *${waitData.type === "chat" ? "Message" : "Inquiry"} Received!*\n\n` +
        `Thank you, *${userName}*! 🙏\n\n` +
        `Our team will attend to you within *30 minutes* ⏳\n\n` +
        `━━━━━━━━━━━━━━\n` +
        `We appreciate your patience 🙌`
      );
    }

    // ===== OPTION 3: BUY DATA =====
    if (isStoreMode && body === "3") {
      
      if (!config.DATA_LINK) {
        return m.reply("⚠️ Data purchase link not configured.");
      }

      return m.reply(
        `📶 *Buy Data Plans*\n\n` +
        `Click the link below to purchase:\n\n` +
        `🔗 ${config.DATA_LINK}\n\n` +
        `━━━━━━━━━━━━━━\n` +
        `💡 Need help? Reply with "1" to chat with us!`
      );
    }

    // ===== OPTION 4: SHOP PRODUCTS =====
    if (isStoreMode && body === "4") {
      
      if (!config.STORE_LINK) {
        return m.reply("⚠️ Store link not configured.");
      }

      return m.reply(
        `🛒 *Shop Our Products*\n\n` +
        `Browse our catalog:\n\n` +
        `🔗 ${config.STORE_LINK}\n\n` +
        `━━━━━━━━━━━━━━\n` +
        `💡 Questions? Reply with "2" for inquiries!`
      );
    }

    // ===== COMMANDS =====
    if(body.startsWith(config.PREFIX)){
      const args =
        body.slice(1).split(" ");

      const cmdName =
        args.shift();

      const cmd =
        commands.get(cmdName);

      if(cmd)
        cmd.execute(sock,m,args);
    }

  });

  // ===== GHOST MODE =====
  sock.ev.on("connection.update",(u)=>{
    if(u.connection==="open"){
        console.log("👻 Ghost Mode Active");

        if(config.GHOST_MODE){
        sock.sendPresenceUpdate("unavailable");
        }
    }
    });

  // ===== GROUP UPDATES JIDS =====
  sock.ev.on("groups.update", (updates) => {
    updates.forEach(g => {
      console.log("📌 GROUP JID:", g.id);
    });
  });

  // ===== ANTI DELETE =====
    sock.ev.on("messages.update", async updates => {

    if(!config.ANTI_DELETE) return;

    for(const u of updates){

        if(u.update?.message === null){

        let msg = store.get(u.key.id);
        if(!msg) return;

        const owner =
            config.OWNER_NUMBER + "@s.whatsapp.net";

        const sender =
            msg.key.participant ||
            msg.key.remoteJid;

        const chat = u.key.remoteJid;

        const mtype =
            getContentType(msg.message);

        // ===== HEADER INFO =====
        await sock.sendMessage(owner,{
            text:
    `🚨 *Deleted Message*

    👤 From: ${sender.split("@")[0]}
    💬 Chat: ${chat}`
        });

        // ===== TEXT =====
        if(mtype === "conversation" ||
            mtype === "extendedTextMessage"){

            let text =
            msg.message.conversation ||
            msg.message.extendedTextMessage.text;

            return sock.sendMessage(owner,{
            text:`📝 Message:\n${text}`
            });
        }

        // ===== MEDIA =====
        try{
            const mediaMsg =
            msg.message[mtype];

            const stream =
            await downloadContentFromMessage(
                mediaMsg,
                mtype.replace("Message","")
            );

            let buffer = Buffer.from([]);
            for await(const chunk of stream){
            buffer = Buffer.concat([buffer,chunk]);
            }

            let send = {};

            if(mtype==="imageMessage")
            send.image = buffer;

            else if(mtype==="videoMessage")
            send.video = buffer;

            else if(mtype==="audioMessage"){
            send.audio = buffer;
            send.mimetype = "audio/mpeg";
            send.ptt = true;
            }

            else if(mtype==="stickerMessage")
            send.sticker = buffer;

            else if(mtype==="documentMessage"){
            send.document = buffer;
            send.fileName =
                mediaMsg.fileName || "file";
            }

            await sock.sendMessage(owner, send);

        }catch(e){
            await sock.sendMessage(owner,{
            text:"⚠️ Failed to recover media"
            });
        }

        }
    }
    });

    // ===== WELCOME & GOODBYE PRO =====
    sock.ev.on(
      "group-participants.update",
      async (data) => {

        try {
          const { db } = require("./database");

          const g = data.id;

          // Check if welcome is enabled
          if (!db.groups?.[g]?.welcome)
            return;

          // Get group metadata
          const meta = await sock.groupMetadata(g);

          const groupName = meta.subject;
          const members = meta.participants.length;

          // Default banner (you can customize this)
          const banner = 
            db.groups[g]?.banner || 
            "https://files.catbox.moe/f9gwsx.jpg";

          for (let user of data.participants) {

            const mention = `@${user.split("@")[0]}`;
            const userName = user.split("@")[0];

            // ===== DEFAULT WELCOME TEXT =====
            const defaultWelcome = 
    `╭━━━〔 👋 Welcome 〕━━━⬣
    ┃ Hello @user
    ┃ Welcome to *{group}*
    ┃ 👥 Members: {members}
    ╰━━━━━━━━━━━━━━⬣

    ✨ Please read group rules
    ✨ Enjoy your stay 🎉`;

            // ===== DEFAULT BYE TEXT =====
            const defaultBye = 
    `╭━━━〔 👋 Goodbye 〕━━━⬣
    ┃ @user left
    ┃ From *{group}*
    ┃ 👥 Members: {members}
    ╰━━━━━━━━━━━━━━⬣

    We will miss you 💛`;

            // Get custom text or use default
            let welcomeText = db.groups[g].text || defaultWelcome;
            let byeText = db.groups[g].bye || defaultBye;

            // ===== REPLACE VARIABLES =====
            welcomeText = welcomeText
              .replace(/@user/g, mention)
              .replace(/{user}/g, mention)
              .replace(/{name}/g, userName)
              .replace(/{group}/g, groupName)
              .replace(/{members}/g, members);

            byeText = byeText
              .replace(/@user/g, mention)
              .replace(/{user}/g, mention)
              .replace(/{name}/g, userName)
              .replace(/{group}/g, groupName)
              .replace(/{members}/g, members);

            // ===== JOIN EVENT =====
            if (data.action === "add") {

              // Check if image should be sent
              if (db.groups[g]?.welcomeImage !== false) {
                await sock.sendMessage(
                  g,
                  {
                    image: { url: banner },
                    caption: welcomeText,
                    mentions: [user]
                  }
                );
              } else {
                // Text only
                await sock.sendMessage(
                  g,
                  {
                    text: welcomeText,
                    mentions: [user]
                  }
                );
              }

              console.log(`✅ Welcome sent to ${mention} in ${groupName}`);
            }

            // ===== LEAVE/REMOVE EVENT =====
            if (data.action === "remove") {

              // Check if image should be sent
              if (db.groups[g]?.welcomeImage !== false) {
                await sock.sendMessage(
                  g,
                  {
                    image: { url: banner },
                    caption: byeText,
                    mentions: [user]
                  }
                );
              } else {
                // Text only
                await sock.sendMessage(
                  g,
                  {
                    text: byeText,
                    mentions: [user]
                  }
                );
              }

              console.log(`👋 Goodbye sent for ${mention} in ${groupName}`);
            }

          }

        } catch (error) {
          console.error("Welcome/Goodbye Error:", error);
          // Don't crash the bot if welcome fails
        }
      }
    );
}

startBot();
