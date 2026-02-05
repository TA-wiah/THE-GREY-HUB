<div align="center">

# 👻 GhostSlayer WhatsApp Bot

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=THE-GREY-HUB%20Bot&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=00FF41&center=true&vCenter=true&random=false&width=600&lines=Multi-Device+WhatsApp+Bot;Built+with+Baileys;AI+Powered+%7C+Fast+%7C+Reliable;Auto+Downloads+%7C+Group+Tools;Always+Online+24%2F7)](https://git.io/typing-svg)

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#hosting">Hosting</a> •
  <a href="#usage">Usage</a> •
  <a href="#support">Support</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
  <img src="https://img.shields.io/badge/Baileys-00E676?style=for-the-badge&logo=whatsapp&logoColor=white"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/TA-wiah/THE-GREY-HUB?style=social"/>
  <img src="https://img.shields.io/github/forks/TA-wiah/THE-GREY-HUB?style=social"/>
  <img src="https://img.shields.io/github/issues/TA-wiah/THE-GREY-HUB"/>
  <img src="https://img.shields.io/github/license/TA-wiah/THE-GREY-HUB"/>
</p>

### 🚀 A powerful multi-device WhatsApp bot designed for automation, moderation, downloads, and AI chat.

**Fast • Clean • Reliable**

---

</div>

## 📖 About

**GhostSlayer** is a feature-rich WhatsApp bot built on the Baileys library, designed to automate tasks, moderate groups, download media, and provide AI-powered conversations. Whether you're managing communities or building automation systems, GhostSlayer has you covered.

<div align="center">

### ⭐ Star this repo if you find it useful!

[![Fork Repo](https://img.shields.io/github/forks/TA-wiah/THE-GREY-HUB?style=social)](https://github.com/TA-wiah/THE-GREY-HUB/fork)
[![Download](https://img.shields.io/badge/Download-Latest%20Release-brightgreen?style=for-the-badge&logo=github)](https://github.com/TA-wiah/THE-GREY-HUB/archive/refs/heads/main.zip)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI & Automation
- ✅ AI Chat command
- ✅ Smart auto replies
- ✅ Auto reactions
- ✅ Typing/recording simulation
- ✅ Context-aware responses

### 📥 Media Downloaders
- ✅ YouTube (audio/video)
- ✅ TikTok downloader
- ✅ Instagram downloader
- ✅ Multi-link auto detect
- ✅ Fast & reliable downloads

### ⚙️ System Tools
- ✅ Ghost Mode (no read receipts)
- ✅ Dashboard stats
- ✅ XP leveling system
- ✅ View-once opener
- ✅ Multi-device pairing

</td>
<td width="50%">

### 🛡️ Group Management
- ✅ Welcome & Goodbye system
- ✅ Tag all / mention tools
- ✅ Admin controls
- ✅ Anti-delete messages
- ✅ Anti-link protection
- ✅ Kick/Ban/Warn system

### 🎯 Business Tools
- ✅ Data selling menu
- ✅ Shop integration
- ✅ Inquiry routing to owner
- ✅ Auto-reply for business
- ✅ Custom pricing lists

### 🔒 Security & Privacy
- ✅ Owner-only commands
- ✅ Private number mode
- ✅ Session encryption
- ✅ Spam protection

</td>
</tr>
</table>

---

## 🚀 Installation

### Prerequisites
- Node.js v16 or higher
- Git
- A phone number for WhatsApp

### Quick Start

```bash
# Clone the repository
git clone https://github.com/TA-wiah/THE-GREY-HUB
cd THE-GREY-HUB

# Install dependencies
npm install

# Run the bot
npm start
```

### First Time Setup

1. **Start the bot** - Run `npm start`
2. **Scan QR Code** - Open WhatsApp → Linked Devices → Link a Device
3. **Scan the QR** displayed in your terminal
4. **Done!** ✅ Your bot is now online

---

## 🌍 Hosting

### ✅ Recommended: Koyeb (Best Free Option)

1. Push your bot to GitHub
2. Create a [Koyeb](https://www.koyeb.com/) account
3. Deploy from GitHub repository
4. Instance type: **Nano** (Free)
5. Start command: `npm start`

**Pros:** Free tier available, persistent WebSocket support, auto-restarts

### ✅ Railway

1. Create new project on [Railway](https://railway.app/)
2. Deploy from GitHub
3. Add Node.js environment
4. Start command: `npm start`

**Pros:** Easy deployment, generous free tier

### ✅ VPS Hosting (Best Control)

For 24/7 reliability, use a VPS:

```bash
# Install PM2 for process management
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name THE-GREY-HUB

# Save PM2 configuration
pm2 save

# Enable auto-start on reboot
pm2 startup
```

### ⚠️ Not Recommended: Vercel

Vercel is serverless and kills WebSocket connections, making it unsuitable for WhatsApp bots.

---

## 📁 Project Structure

```
THE-GREY-HUB/
├── commands/          # Bot commands
├── database/          # Data storage
├── sessions/          # WhatsApp sessions
├── config.js          # Configuration file
├── index.js           # Main bot file
├── runner.js          # Auto-restart handler
└── package.json       # Dependencies
```

---

## 🔧 Configuration

Edit `config.js` to customize your bot:

```javascript
module.exports = {
  prefix: '.',                    // Command prefix
  owner:'1234567890',         // Owner numbers
  botName: 'THE-GREY-HUB',        // Bot name
  shopLink: 'your-shop-link',    // Shop URL
  
  // Feature toggles
  autoReply: true,
  antiDelete: true,
  antiLink: true,
  welcomeMsg: true
}
```

---

## 📡 Auto-Restart Configuration

Create `runner.js` for automatic restarts:

```javascript
const { spawn } = require("child_process");

function start() {
  const bot = spawn("node", ["index.js"], { stdio: "inherit" });
  
  bot.on("close", (code) => {
    console.log(`Bot stopped (${code}) - restarting...`);
    start();
  });
}

start();
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "node runner.js"
  }
}
```

---

## 🎯 Usage

### Basic Commands

| Command | Description |
|---------|-------------|
| `.menu` | Display all commands |
| `.ai <query>` | Chat with AI |
| `.ytdl <url>` | Download YouTube video |
| `.tiktok <url>` | Download TikTok video |
| `.tagall` | Mention all members |
| `.ghost` | Toggle ghost mode |

### Admin Commands

| Command | Description |
|---------|-------------|
| `.kick @user` | Remove member |
| `.promote @user` | Make admin |
| `.demote @user` | Remove admin |
| `.antilink on/off` | Toggle link protection |

---

## 📥 Downloads

<div align="center">

### Get Started Now!

[![Download ZIP](https://custom-icon-badges.demolab.com/badge/-Download-blue?style=for-the-badge&logo=download&logoColor=white)](https://github.com/TA-wiah/THE-GREY-HUB/archive/refs/heads/main.zip)
[![Clone Repo](https://custom-icon-badges.demolab.com/badge/-Clone-green?style=for-the-badge&logo=repo-clone&logoColor=white)](https://github.com/TA-wiah/THE-GREY-HUB.git)
[![Fork](https://custom-icon-badges.demolab.com/badge/-Fork-orange?style=for-the-badge&logo=repo-forked&logoColor=white)](https://github.com/TA-wiah/THE-GREY-HUB/fork)

</div>

---

## 👑 Developer

<div align="center">

**THE-GREY-HUB Bot**  
Developed by **Jeffrey**

Available for:
- 🤖 Bot Development
- 🌐 Web Systems
- ⚡ Automation Projects

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TA-wiah)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/233547838433)
[![WhatsApp Group](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/YOUR_INVITE_CODE)
[![Join Community](https://img.shields.io/badge/Join%20Community-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/YOUR_LINK)


</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This bot is for educational purposes only. Use responsibly and respect WhatsApp's Terms of Service.

---

## 💡 Support

If you encounter any issues or have questions:

- 📖 Check the [Wiki](https://github.com/TA-wiah/THE-GREY-HUB/wiki)
- 🐛 Report bugs in [Issues](https://github.com/TA-wiah/THE-GREY-HUB/issues)
- 💬 Join our [WhatsApp Group](https://chat.whatsapp.com/your-group-link)

---

<div align="center">

### ⭐ Show Your Support

If this project helped you, please give it a ⭐!

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer"/>

**Made with ❤️ by Jeffrey**

</div>
