const { execSync } = require('child_process');
const fs = require('fs');

module.exports = async (sock, msg, args, config) => {
    const query = args.join(' ');
    if (!query) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ O que você quer baixar?" });

    let sentMsg = await sock.sendMessage(msg.key.remoteJid, { text: "🔍 *Pesquisando...*" });

    try {
        // 1. Busca info (sem precisar de nada extra)
        execSync(`yt-dlp -j "ytsearch1:${query}" > info_vid.json`);
        const info = JSON.parse(fs.readFileSync('info_vid.json'));
        const duracao = new Date(info.duration * 1000).toISOString().substr(11, 8);

        // 2. Card inicial
        const legenda = `🎬 *${info.title}*\n⏱️ *Duração:* ${duracao}\n📥 *Baixando (sem conversão)...*`;
        await sock.sendMessage(msg.key.remoteJid, { image: { url: info.thumbnail }, caption: legenda, edit: sentMsg.key });

        // 3. Download forçado: busca especificamente um formato MP4 que o WhatsApp aceita nativamente
        // O parâmetro -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" garante que o yt-dlp pegue um arquivo compatível
        execSync(`yt-dlp -f "best[ext=mp4]" -o "video.mp4" "${info.webpage_url}"`);

        // 4. Envio
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ *Download concluído!* Enviando...", edit: sentMsg.key });
        
        await sock.sendMessage(msg.key.remoteJid, { 
            video: fs.readFileSync('./video.mp4'), 
            caption: info.title,
            mimetype: 'video/mp4' 
        });

    } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro (pode ser que o vídeo não tenha formato MP4 nativo): " + e.message, edit: sentMsg.key });
    }
};

