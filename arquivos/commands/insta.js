const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg) => {
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const args = text.split(" ").slice(1).join(" ");
    
    if (!args) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Mande o link!" }, { quoted: msg });

    try {
        await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Baixando via yt-dlp..." }, { quoted: msg });

        const videoPath = path.join(__dirname, `video_${msg.key.id}.mp4`);
        
        // Comando para baixar usando yt-dlp
        const command = `yt-dlp -o "${videoPath}" "${args}"`;

        exec(command, async (error) => {
            if (error) {
                await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro no yt-dlp: " + error.message }, { quoted: msg });
                return;
            }

            // Envia o vídeo baixado
            await sock.sendMessage(msg.key.remoteJid, { 
                video: fs.readFileSync(videoPath), 
                caption: "✅ Sucesso com yt-dlp!" 
            }, { quoted: msg });

            // Remove o arquivo após enviar para não encher a memória da sua Box
            fs.unlinkSync(videoPath);
            await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });
        });

    } catch (e) {
        console.error("Erro:", e.message);
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erro inesperado." }, { quoted: msg });
    }
};

