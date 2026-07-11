module.exports = async (sock, msg) => {
    // Pega o nome de quem foi marcado ou respondeu a mensagem
    const citada = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!citada) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Marque alguém para dar um abraço!" }, { quoted: msg });
    }

    const nome = "@" + citada.split("@")[0];
    await sock.sendMessage(msg.key.remoteJid, { 
        text: `💋 *${nome}* recebeu um beijo!.`,
        mentions: [citada]
    }, { quoted: msg });
};

