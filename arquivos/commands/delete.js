module.exports = async (sock, msg) => {
    // Verifica se você respondeu a uma mensagem
    if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo) {
        return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Responda uma mensagem para deletar.' });
    }

    const key = msg.message.extendedTextMessage.contextInfo.participant ? {
        remoteJid: msg.key.remoteJid,
        fromMe: false,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
        participant: msg.message.extendedTextMessage.contextInfo.participant
    } : {
        remoteJid: msg.key.remoteJid,
        fromMe: true, // Ajuste se for deletar msg dos outros
        id: msg.message.extendedTextMessage.contextInfo.stanzaId
    };

    await sock.sendMessage(msg.key.remoteJid, { delete: key });
};

