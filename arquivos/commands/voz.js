const axios = require('axios');
const fs = require('fs');

module.exports = async (sock, msg) => {
// Substitua o seu IF atual por este:
const args = msg.message.extendedTextMessage?.text.split(" ").slice(1).join(" ") || msg.message.conversation?.split(" ").slice(1).join(" ");

if (!args || args.trim() === "") {
    return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Digite algo!" }, { quoted: msg });
}

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(args)}`;
    const path = './temp_audio.mp3';

    try {
        const response = await axios({ method: 'get', url, responseType: 'stream' });
        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            await sock.sendMessage(msg.key.remoteJid, { 
                audio: { url: path }, 
                mimetype: 'audio/mp4' 
            }, { quoted: msg });
            fs.unlinkSync(path); // Deleta o arquivo após enviar
        });
    } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro ao baixar o áudio." }, { quoted: msg });
    }
};

