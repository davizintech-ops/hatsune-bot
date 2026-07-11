const axios = require('axios');

module.exports = async (sock, msg, args, config) => {
    // Reação de carregamento
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "⏳", key: msg.key } });

    try {
        // Chamada da API pública (exemplo: categoria 'waifu')
        const { data } = await axios.get('https://api.waifu.pics/sfw/waifu');
        const imageUrl = data.url;

        // Envio da imagem com estilo
        await sock.sendMessage(msg.key.remoteJid, { 
            image: { url: imageUrl },
            caption: `┌───「 *RANDOM IMAGE* 」\n│ \n│ 🎨 *FONTE:* Waifu.pics API\n│ 👤 *USER:* ${msg.pushName || 'Usuário'}\n│ \n└──────────────`
        });

    } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ *Erro:* Falha ao buscar imagem na API." });
    }
};

