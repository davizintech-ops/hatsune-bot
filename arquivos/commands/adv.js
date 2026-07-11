const fs = require("fs");

const db = "./arquivos/database/adv.json";

function barra(qtd) {
    let cheio = "🩵".repeat(qtd);
    let vazio = "⬜".repeat(3 - qtd);
    return cheio + vazio;
}

module.exports = async (sock, msg, args) => {

    if (!msg.key.remoteJid.endsWith("@g.us")) {
        return sock.sendMessage(msg.key.remoteJid, {
            text: "🩵 Sistema ADV disponível apenas em grupos!"
        });
    }

    const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!user) {
        return sock.sendMessage(msg.key.remoteJid, {
            text:
`╭━━━〔 🩵 HATSUNE ADV 〕━━━╮

⚠️ Marque alguém para aplicar uma advertência.

Exemplo:
?adv @usuario motivo

╰━━━━━━━━━━━━━━━━━━╯`
        });
    }


    const motivo = args.slice(1).join(" ") || "Motivo não informado";


    if (!fs.existsSync(db)) {
        fs.writeFileSync(db, "{}");
    }


    let adv = JSON.parse(fs.readFileSync(db));


    if (!adv[user]) {
        adv[user] = {
            total: 0,
            historico: []
        };
    }


    adv[user].total++;

    adv[user].historico.push({
        motivo: motivo,
        data: new Date().toLocaleString("pt-BR")
    });


    fs.writeFileSync(
        db,
        JSON.stringify(adv, null, 2)
    );


    let total = adv[user].total;


    let status;

    if (total >= 3) {
        status = "🚨 LIMITE ATINGIDO - REMOVENDO";
    } 
    else if (total == 2) {
        status = "⚠️ Última chance";
    } 
    else {
        status = "✅ Usuário monitorado";
    }

    await sock.sendMessage(msg.key.remoteJid,{react:{text:"✅️",key:msg.key}});
    await sock.sendMessage(msg.key.remoteJid, {

        text:
`╭━━━〔 🩵 HATSUNE ADV 〕━━━╮

👤 Usuário:
@${user.split("@")[0]}

⚠️ Advertências:
${total}/3

📊 Progresso:
${barra(Math.min(total,3))}

📝 Motivo:
${motivo}

🕒 Data:
${new Date().toLocaleString("pt-BR")}

📌 Status:
${status}

╰━━━━━━━━━━━━━━━━━━╯

🩵 HatsuneBot Security System`,

        mentions: [user]

    });


    // BAN AUTOMÁTICO NO 3/3
    if (total >= 3) {

        try {
            await sock.sendMessage(msg.key.remoteJid,{react:{text:"🚨",key:msg.key}});
            await sock.sendMessage(msg.key.remoteJid, {
                text:
`🚨 *AUTO-MODERAÇÃO*

Usuário atingiu 3/3 advertências.

🚫 Removendo do grupo...`,
                mentions: [user]
            });


            await sock.groupParticipantsUpdate(
                msg.key.remoteJid,
                [user],
                "remove"
            );


            await sock.sendMessage(msg.key.remoteJid, {
                text:
`✅️| Usuário removido automaticamente pelo HatsuneBot.`
            });


        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid,{react:{text:"⚠️",key:msg.key}});
            await sock.sendMessage(msg.key.remoteJid, {
                text:
`╭━━━〔   HATSUNE ADV 〕━━━╮
       
       ⚠️ ATENÇAO ADMS!
============================
eu não consegui remover o @${user.split("@")[0]}!

verifique se sou adm do grupo.
╰━━━━━━━━━━━━━━━━━━╯`
            });

        }

    }

};
