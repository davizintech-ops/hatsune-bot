module.exports = async (sock, msg) => {
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const participants = groupMetadata.participants.map(p => p.id);
    
    // Pega dois participantes aleatórios
    const p1 = participants[Math.floor(Math.random() * participants.length)];
    const p2 = participants[Math.floor(Math.random() * participants.length)];
    const amor = Math.floor(Math.random() * 101);

    // Lógica das mensagens por porcentagem
    let msgAmor = "";
    if (amor < 20) msgAmor = "Melhor nem tentar... 💔";
    else if (amor < 40) msgAmor = "Amizade colorida, talvez? 🤔";
    else if (amor < 60) msgAmor = "Combinação interessante! ✨";
    else if (amor < 80) msgAmor = "Tem muito fogo nesse casal! 🔥";
    else msgAmor = "Almas gêmeas! Casamento pra ontem! 💍";

    const resultado = `
╔══〔 💘 𝗦𝗛𝗜𝗣 𝗗𝗢 𝗗𝗜𝗔 〕══╗
┃
┃ ➔ 𝗨𝘀𝘂𝗮́𝗿𝗶𝗼 𝟭: @${p1.split('@')[0]}
┃ ➔ 𝗨𝘀𝘂𝗮́𝗿𝗶𝗼 𝟮: @${p2.split('@')[0]}
┃ ➔ 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝗱𝗮𝗱𝗲: ${amor}%
┃
┃ ➔ 𝗩𝗲𝗿𝗲𝗱𝗶𝘁𝗼: ${msgAmor}
┃
╚══════════════════════╝
🩵 _HatsuneBot - ${amor}% de chance._`;

    await sock.sendMessage(msg.key.remoteJid, { 
        text: resultado, 
        mentions: [p1, p2] 
    }, { quoted: msg });
};

