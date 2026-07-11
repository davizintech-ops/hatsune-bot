module.exports = async (sock, msg, args, config) => {
    const name = args.join(' ');
    if (!name) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Digite o nome.' });
    await sock.groupUpdateSubject(msg.key.remoteJid, name);
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } });
};

