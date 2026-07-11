module.exports = async (sock, msg, args, config) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Marque alguém.' });
    await sock.groupParticipantsUpdate(msg.key.remoteJid, [mentioned], 'promote');
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '👑', key: msg.key } });
};

