module.exports = async (sock, msg) => {
    let mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let target = mentioned || msg.key.participant || msg.key.remoteJid;

    // Correção: Busca segura do nome
    let nome;
    try {
        const contact = await sock.onWhatsApp(target);
        nome = contact[0]?.pushname || "Usuário";
    } catch {
        nome = "Usuário";
    }

    const feio = Math.floor(Math.random() * 101);
    
    let veredito = "";
    if (feio < 20) veredito = "Uma verdadeira obra de arte! 🎨";
    else if (feio < 40) veredito = "Até que dá pro gasto... 🤷";
    else if (feio < 70) veredito = "Passa longe do espelho! 🪞";
    else veredito = "Corra! O espelho quebrou! 😱";

    const barra = '█'.repeat(Math.floor(feio / 10)) + '▒'.repeat(10 - Math.floor(feio / 10));

    await sock.sendMessage(msg.key.remoteJid, { 
        text: `╔══〔 🤡 𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗘 𝗙𝗘𝗜𝗢 〕══╗\n┃\n┃ ➔ 𝗡𝗼𝗺𝗲: ${nome}\n┃ ➔ 𝗡𝗶́𝘃𝗲𝗹: ${feio}%\n┃ ${barra}\n┃\n┃ ➔ 𝗩𝗲𝗿𝗲𝗱𝗶𝘁𝗼: ${veredito}\n┃\n╚══════════════════════════╝\n🩵 _HatsuneBot - Status verificado._`
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🩵', key: msg.key } });
};

