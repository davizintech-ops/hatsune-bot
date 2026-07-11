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

    const gado = Math.floor(Math.random() * 101);
    
    let veredito = "";
    if (gado < 20) veredito = "Membro honrado, não é gado! 🛡️";
    else if (gado < 50) veredito = "Tá começando a baixar o Tinder... 📱";
    else if (gado < 80) veredito = "Gado nível intermediário! 🐮";
    else veredito = "Gado master, chegou no nível premium! 🐂";

    const barra = '█'.repeat(Math.floor(gado / 10)) + '▒'.repeat(10 - Math.floor(gado / 10));

    await sock.sendMessage(msg.key.remoteJid, { 
        text: `╔══〔 🐮 𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗘 𝗚𝗔𝗗𝗢 〕══╗\n┃\n┃ ➔ 𝗡𝗼𝗺𝗲: ${nome}\n┃ ➔ 𝗡𝗶́𝘃𝗲𝗹: ${gado}%\n┃ ${barra}\n┃\n┃ ➔ 𝗩𝗲𝗿𝗲𝗱𝗶𝘁𝗼: ${veredito}\n┃\n╚══════════════════════╝\n🩵 _HatsuneBot - Mooo..._`
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🩵', key: msg.key } });
};

