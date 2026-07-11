module.exports = async (sock, msg, args, config) => {
await sock.sendMessage(msg.key.remoteJid, {
    react: {
        text: "🎉", // Aqui você coloca o emoji que quiser
        key: msg.key // Isso garante que o bot reaja exatamente à mensagem que disparou o comando
    }
});

    const chat = msg.key.remoteJid;
    
    // Pega o prêmio digitado pelo usuário ou coloca "Não informado"
    const premio = args.length > 0 ? args.join(' ') : 'Não informado';

    // Pega os participantes do grupo
    const groupMetadata = await sock.groupMetadata(chat);
    const participantes = groupMetadata.participants.map(p => p.id);
    
    // Escolhe um participante aleatório
    const sorteado = participantes[Math.floor(Math.random() * participantes.length)];
    
    // Monta o texto no formato que você pediu
    const textoSorteio = `
--------------------------------------
📢 - SORTEIO DE ULTIMA HORA!
--------------------------------------

🎁 - PREMIO: ${premio}

🤯 - Sorteado: @${sorteado.split('@')[0]}

parabéns mano!
--------------------------------------`.trim();

    // Envia a imagem com o texto do sorteio
    await sock.sendMessage(chat, { 
        image: { url: './arquivos/media/menu.jpg' }, 
        caption: textoSorteio,
        mentions: [sorteado] 
    });
};

