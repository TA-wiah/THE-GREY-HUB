const { spawn } = require("child_process");

function start() {
  const bot = spawn("node", ["index.js"], { stdio: "inherit" });
  
  bot.on("close", (code) => {
    console.log(`Bot stopped (${code}) - restarting...`);
    start();
  });
}

start();