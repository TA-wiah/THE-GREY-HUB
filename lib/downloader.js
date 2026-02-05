const fs = require("fs");
const axios = require("axios");
const ytdl = require("ytdl-core");

const queue = [];
let busy = false;

const CACHE = "./cache/";
if(!fs.existsSync(CACHE))
  fs.mkdirSync(CACHE);

// ===== PROCESS QUEUE =====
async function processQueue(sock){
  if(busy || queue.length===0) return;

  busy = true;

  const job = queue.shift();

  try{
    await job.run();
  }catch(e){
    console.log("Job error:",e);
  }

  busy = false;
  processQueue(sock);
}

// ===== ADD TO QUEUE =====
function addJob(sock,job){
  queue.push(job);
  processQueue(sock);
}

// ===== YOUTUBE =====
async function handleYouTube(sock,m,url){

  const id =
    ytdl.getURLVideoID(url);

  const file =
    `${CACHE}${id}.mp4`;

  // CDN CACHE HIT
  if(fs.existsSync(file)){
    return sock.sendMessage(
      m.chat,
      { video: fs.readFileSync(file) },
      { quoted:m }
    );
  }

  const stream =
    ytdl(url,{quality:"18"});

  const write =
    fs.createWriteStream(file);

  stream.pipe(write);

  write.on("finish", async()=>{
    await sock.sendMessage(
      m.chat,
      { video: fs.readFileSync(file) },
      { quoted:m }
    );
  });
}

// ===== TIKTOK / IG / LINKEDIN =====
async function handleAPI(sock,m,url){

  const res =
    await axios.get(
`https://api.tiklydown.eu.org/api/download?url=${url}`
    );

  await sock.sendMessage(
    m.chat,
    { video:{url:res.data.video.noWatermark}},
    { quoted:m }
  );
}

module.exports = {
  addJob,
  handleYouTube,
  handleAPI
};
