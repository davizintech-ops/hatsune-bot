const fs = require('fs');

module.exports = async (sock, msg, args) => {
    // Verifica se o usuário enviou o texto das regras
    const novasRegras = args.join(' ');
    if (!novasRegras) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Envie as novas regras!' }, { quoted: msg });
    
    // Salva o arquivo
    fs.writeFileSync('./regras.txt', novasRegras);
    
    // Cria o preview visual
    const previewTexto = `*SALVO COM SUCESSO!*\n\n╔══〔 📜 𝗣𝗥𝗘𝗩𝗜𝗘𝗪 𝗗𝗔𝗦 𝗥𝗘𝗚𝗥𝗔𝗦 〕══╗\n┃\n┃ ${novasRegras}\n┃\n╚══════════════════════════╝\n🩵 _Regras salvas com sucesso!_`;
    
    // Envia a confirmação e o preview
    await sock.sendMessage(msg.key.remoteJid, { text: previewTexto }, { quoted: msg });
    
    // Reação final
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } });
};

