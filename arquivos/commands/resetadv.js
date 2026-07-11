const fs = require("fs");

const db = "./arquivos/database/adv.json";

module.exports = async (sock, msg) => {

    const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!user) {
        return sock.sendMessage(msg.key.remoteJid, {
            text:
`╭━━━〔 🩵 HATSUNE RESET ADV 〕━━━╮

⚠️ Marque um usuário para resetar as advertências.

Exemplo:
?resetadv @usuário

╰━━━━━━━━━━━━━━━━━━╯`
        });
    }


    if (!fs.existsSync(db)) {
        fs.writeFileSync(db, "{}");
    }


    let adv = JSON.parse(fs.readFileSync(db));


    if (!adv[user]) {
        return sock.sendMessage(msg.key.remoteJid, {
            text:
`🩵 Nenhuma advertência encontrada para @${user.split("@")[0]}!`,
            mentions: [user]
        });
    }


    const antigas = adv[user].total || 0;


    adv[user] = {
        total: 0,
        historico: []
    };


    fs.writeFileSync(
        db,
        JSON.stringify(adv, null, 2)
    );


    await sock.sendMessage(msg.key.remoteJid, {

        text:
`╭━━━〔 🩵 HATSUNE RESET ADV 〕━━━╮

👤 Usuário:
@${user.split("@")[0]}

♻️ Advertências removidas:
${antigas} ➜ 0

✨ Histórico apagado!

📌 Status:
✅ Usuário limpo

╰━━━━━━━━━━━━━━━━━━╯

🩵 *HatsuneBot Security System*`,

        mentions: [user]

    });

};
