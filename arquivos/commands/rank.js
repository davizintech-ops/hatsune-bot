const fs = require("fs");
const path = require("path");

module.exports = async (sock, msg) => {

    const xpFile = path.join(__dirname, "../database/xp.json");

    if (!fs.existsSync(xpFile)) {
        fs.writeFileSync(xpFile, "{}");
    }

    const xpData = JSON.parse(
        fs.readFileSync(xpFile, "utf8")
    );

    const user = msg.key.participant || msg.key.remoteJid;

    if (!xpData[user]) {
        xpData[user] = {
            xp: 0,
            level: 1
        };
    }

    const texto =
`╭━━━〔 🩵 *HATSUNE RANK* 〕━━━╮

👤 *Usuário*
└─ @${user.split("@")[0]}

✨ *Experiência*
└─ ⭐ XP: ${xpData[user].xp}

🎖️ *Progresso*
└─ 📈 Level: ${xpData[user].level}

💎 Continue usando o HatsuneBot
para subir no ranking!

╰━━━〔 🩵 *HATSUNE BOT* 〕━━━╯`;

    const imagem = "./arquivos/media/menu.jpg";

    if (fs.existsSync(imagem)) {
        await sock.sendMessage(msg.key.remoteJid, {
            image: fs.readFileSync(imagem),
            caption: texto,
            mentions: [user]
        });
    } else {
        await sock.sendMessage(msg.key.remoteJid, {
            text: texto,
            mentions: [user]
        });
    }

    await sock.sendMessage(msg.key.remoteJid, {
        react: {
            text: "🏆",
            key: msg.key
        }
    });
};
