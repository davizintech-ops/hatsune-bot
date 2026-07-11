module.exports = async (sock, msg, args, config) => {
    // 1. Reação
    await sock.sendMessage(msg.key.remoteJid, {
        react: {
            text: "🤣", // VÍRGULA ADICIONADA AQUI
            key: msg.key 
        }
    });

    // 2. Pega o ID de quem marcou
    const sender = msg.key.participant || msg.key.remoteJid;

    // 3. Pega o ID de quem foi marcado
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

    // 4. Verifica se houve marcação
    if (mentioned.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, { text: 'Marque alguém para ser de pintore!' });
    }

    const userMarcado = mentioned[0]; 
    const autor = sender; 

    // 5. Lista de pessoas para o WhatsApp reconhecer a marcação
    const targets = [userMarcado, autor];

    const texto = `――――――――――
@${userMarcado.split('@')[0]} foi de pintore!😂😂🤣
――――――――――

😂 • @${userMarcado.split('@')[0]} foi marcado e o @${autor.split('@')[0]} quer que envia uma figurinha do pintore! • 🤣

Envia logo se nao sera banido!😂😂😂
――――――――――`;

    // 6. Envia a imagem com o texto acima
    await sock.sendMessage(msg.key.remoteJid, {
        image: { url: './arquivos/media/pintore.jpg' },
        caption: texto,
        mentions: targets
    });
};

