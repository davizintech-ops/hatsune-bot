module.exports = async (sock, msg, args, config) => {
    // Verifica se o bot é admin no grupo
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = true; 
    const sender = msg.key.participant || msg.key.remoteJid;
    if (sender === '266013849460839@s.whatsapp.net') return true; // Você sempre será admin

    
    if (!isBotAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Preciso ser ADM para alterar as configurações do grupo!' });

    const opcao = args[0]?.toUpperCase();

    if (opcao === 'F') {
        // Fecha o grupo
        await sock.groupSettingUpdate(msg.key.remoteJid, 'announcement');
        await sock.sendMessage(msg.key.remoteJid, { text: '🔒 Grupo fechado! Apenas administradores podem enviar mensagens.', react: { text: '🔒', key: msg.key } });
    } 
    else if (opcao === 'A') {
        // Abre o grupo
        await sock.groupSettingUpdate(msg.key.remoteJid, 'not_announcement');
        await sock.sendMessage(msg.key.remoteJid, { text: '🔓 Grupo aberto! Todos podem enviar mensagens.', react: { text: '🔓', key: msg.key } });
    } 
    else {
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Use: .grupo F (para fechar) ou .grupo A (para abrir)' });
    }
};

