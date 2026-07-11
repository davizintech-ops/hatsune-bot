const fs = require('fs');
module.exports = async (sock, msg, args, config) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Marque alguém.' });
    let m = JSON.parse(fs.readFileSync('./mutados.json') || '{}');
    if (m[msg.key.remoteJid]) {
        m[msg.key.remoteJid] = m[msg.key.remoteJid].filter(id => id !== mentioned);
        fs.writeFileSync('./mutados.json', JSON.stringify(m));
    }
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🔊', key: msg.key } });
};

