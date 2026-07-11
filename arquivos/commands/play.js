const { spawn, execSync } = require('child_process');
const fs = require('fs');

module.exports = async (sock, msg, args) => {
    const query = args.join(' ');
    if (!query) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Qual música?" });

    let sentMsg = await sock.sendMessage(msg.key.remoteJid, { text: "🔍 *Procurando...*" });

    try {
        execSync(`yt-dlp -j "ytsearch1:${query}" > info_json`);
        const info = JSON.parse(fs.readFileSync('info_json'));
        const duracao = new Date(info.duration * 1000).toISOString().substr(11, 8);

        const legenda = `🎵 *MÚSICA ENCONTRADA*\n\n📛 *Nome:* ${info.title}\n⏱️ *Duração:* ${duracao}\n\n📥 *Baixando:* [░░░░░░░░░░] 0%`;

        await sock.sendMessage(msg.key.remoteJid, { image: { url: info.thumbnail }, caption: legenda, edit: sentMsg.key });

        const proc = spawn('yt-dlp', ['--extract-audio', '--audio-format', 'mp3', '-o', 'audio.mp3', info.webpage_url]);

        proc.on('close', async (code) => {
            if (code === 0 && fs.existsSync('./audio.mp3')) {
                await sock.sendMessage(msg.key.remoteJid, { text: "✅ *Enviando áudio...*", edit: sentMsg.key });
                await sock.sendMessage(msg.key.remoteJid, { audio: fs.readFileSync('./audio.mp3'), mimetype: 'audio/mpeg' });
            } else {
                await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro ao baixar áudio.", edit: sentMsg.key });
            }
            
            // LIMPEZA OBRIGATÓRIA AQUI
            if (fs.existsSync('./audio.mp3')) fs.unlinkSync('./audio.mp3');
            if (fs.existsSync('./info_json')) fs.unlinkSync('./info_json');
        });

    } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro: " + e.message, edit: sentMsg.key });
    }
};

