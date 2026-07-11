const axios = require('axios');

module.exports = async (sock, msg) => {
    const args = msg.message.extendedTextMessage?.text.split(" ").slice(1).join(" ");
    if (!args) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Mande o link do vídeo!" }, { quoted: msg });

    try {
        // Envia mensagem de processamento
        await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Baixando..." }, { quoted: msg });

const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(args)}`);

// O link do vídeo nessa API fica em data.play, então ajuste assim:
    await sock.sendMessage(msg.key.remoteJid, {
        video: { url: res.data.data.play }, 
        caption: "✅ Download concluído!" 
    }, { quoted: msg });

    } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "❌️", key: msg.key } });
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro ao baixar o vídeo do TikTok. Verifique o link." }, { quoted: msg });
    }
};

