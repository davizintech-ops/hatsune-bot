module.exports = async (sock, msg) => {
    const code = await sock.groupInviteCode(msg.key.remoteJid);
    await sock.sendMessage(msg.key.remoteJid, { text: `🔗 *Link do grupo:* https://chat.whatsapp.com/${code}\n\n⚠️ - AVISO:\nPOR FAVOR, *NAO* DIVULGUE PARA GRUPOS DE *TIGRINHO*.` });
};

