const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async (sock, msg, args, config) => {
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "⏳", key: msg.key } });

    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ *Erro:* Responda a uma imagem para criar a figurinha." });
    }

    await sock.sendMessage(msg.key.remoteJid, { 
        text: `┌───「 *STICKER GENERATOR* 」
│ aguarde, fazendo sua figurinha
└──────────────` 
    });

    const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const sticker = new Sticker(buffer, {
        pack: "HATSUNE BOT", 
        author: "use nosso bot!", 
        type: StickerTypes.FULL,
        quality: 50
    });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });
    await sock.sendMessage(msg.key.remoteJid, { sticker: await sticker.toBuffer() });
};

