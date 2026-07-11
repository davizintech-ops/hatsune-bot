// arquivos/commands/id.js
module.exports = async (sock, msg, args, config) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const emoji = '🆔';

    // 1. Envia a reação
    await sock.sendMessage(msg.key.remoteJid, {
        react: {
            text: emoji,
            key: msg.key 
        }
    });

    // 2. Envia a mensagem com o ID
    await sock.sendMessage(msg.key.remoteJid, { text: `🆔 SEU ID: ${sender}` });
};

