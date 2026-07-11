const fs = require('fs');

module.exports = async (sock, msg) => {
    // Verifica se o arquivo de regras existe, caso não, mostra uma mensagem padrão
    const textoRegras = fs.existsSync('./regras.txt') ? fs.readFileSync('./regras.txt', 'utf8') : '❌ Nenhuma regra foi definida pelo administrador ainda.';
    
    // Formatação visual do menu de regras
    const resposta = `╔══〔 📜 𝗥𝗘𝗚𝗥𝗔𝗦 𝗗𝗢 𝗚𝗥𝗨𝗣𝗢 〕══╗
┃
┃ ${textoRegras}
┃
╚══════════════════════════╝
🩵 _HatsuneBot - Status verificado._`;
    
    // Envia a mensagem com as regras
    await sock.sendMessage(msg.key.remoteJid, { text: resposta }, { quoted: msg });
    
    // Reação automática
    await sock.sendMessage(msg.key.remoteJid, { react: { text: '🩵', key: msg.key } });
};

