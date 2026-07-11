const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async (sock, msg, args, config) => {
    const pack = args[0] || config.botName;
    const author = args.slice(1).join(" ") || config.ownerName;
    
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Responda uma imagem!" });

    const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const sticker = new Sticker(buffer, { pack, author, type: StickerTypes.FULL });
    await sock.sendMessage(msg.key.remoteJid, { sticker: await sticker.toBuffer() });
};

