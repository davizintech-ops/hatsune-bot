// arquivos/commands/id.js
module.exports = async (sock, msg, args, config) => {
    await sock.sendMessage(msg.key.remoteJid, { text: `🆔 ID deste chat: ${msg.key.remoteJid}` });
};

