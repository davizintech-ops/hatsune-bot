module.exports = async (sock, msg) => {
    let mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let target = mentioned || msg.key.participant || msg.key.remoteJid;

    // 1. Busca foto
    let pp;
    try { 
        pp = await sock.profilePictureUrl(target, 'image'); 
    } catch { 
        pp = 'https://i.ibb.co/0J52w2f/avatar.jpg'; 
    }

    // 2. Correção: Busca do nome sem usar sock.getName
    let nome;
    try {
        const contact = await sock.onWhatsApp(target);
        nome = contact[0]?.pushname || "Usuário";
    } catch {
        nome = "Usuário";
    }

    // 3. Busca status
    const status = await sock.fetchStatus(target).catch(() => ({ status: 'Indisponível' }));

    // 4. Gera as porcentagens
    const porcBeleza = Math.floor(Math.random() * 101);
    const porcCorno = Math.floor(Math.random() * 101);
    const porcFeio = Math.floor(Math.random() * 101);

    // 5. Função da barra
    const gerarBarra = (p) => '█'.repeat(Math.floor(p / 10)) + '▒'.repeat(10 - Math.floor(p / 10));

    const barra = gerarBarra(porcBeleza);
    const barraCorno = gerarBarra(porcCorno);
    const barraFeio = gerarBarra(porcFeio);

    // 6. Monta o texto
    const infoPerfil = `
╔══〔 👤 𝗣𝗘𝗥𝗙𝗜𝗟 𝗛𝗔𝗧𝗦𝗨𝗡𝗘𝗕𝗢𝗧 〕══╗
┃
┃ ➔ 𝗡𝗼𝗺𝗲: ${nome}
┃ ➔ 𝗥𝗲𝗰𝗮𝗱𝗼: ${status.status || 'Indisponível'}
┃
┃ ➔ 𝗡𝗶́𝘃𝗲𝗹 𝗱𝗲 𝗕𝗲𝗹𝗲𝘇𝗮:
┃ ${barra} (${porcBeleza}%)
┃
┃ ➔ 𝗦𝘁𝗮𝘁𝘂𝘀 𝗱𝗲 𝗰𝗼𝗿𝗻𝗼:
┃ ${barraCorno} (${porcCorno}%)
┃
┃ ➔ 𝗦𝘁𝗮𝘁𝘂𝘀 𝗱𝗲 𝗳𝗲𝗶𝗼:
┃ ${barraFeio} (${porcFeio}%)
┃
╚══════════════════════════╝
🩵 _HatsuneBot - Status verificado._`;

    await sock.sendMessage(msg.key.remoteJid, {
        image: { url: pp },
        caption: infoPerfil
    }, { quoted: msg });
    
    // Reação de sucesso
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🩵', key: msg.key } });
};

