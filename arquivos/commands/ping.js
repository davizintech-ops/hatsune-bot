const os = require('os');
const { performance } = require('perf_hooks');

module.exports = async (sock, msg) => {
    const inicio = performance.now();
    
    // 1. Informações básicas
    const fim = performance.now();
    const latencia = (fim - inicio).toFixed(2);
    
    // 2. Coleta de dados do sistema
    const so = `${os.type()} (${os.arch()})`;
    const uptime = process.uptime();
    const horas = Math.floor(uptime / 3600);
    const minutos = Math.floor((uptime % 3600) / 60);
    const segundos = Math.floor(uptime % 60);

    // 3. Montagem da mensagem com estilo HatsuneBot
    const resposta = `
╔══〔 ⚡ 𝗣𝗜𝗡𝗚 & 𝗦𝗧𝗔𝗧𝗨𝗦 〕══╗
┃
┃ ➔ 𝗟𝗮𝘁𝗲̂𝗻𝗰𝗶𝗮: ${latencia} ms
┃ ➔ 𝗦𝗶𝘀𝘁𝗲𝗺𝗮: ${so}
┃ ➔ 𝗨𝗽𝘁𝗶𝗺𝗲: ${horas}h ${minutos}m ${segundos}s
┃ ➔ 𝗩𝗲𝗿𝘀𝗮̃𝗼: Node.js ${process.version}
┃
╚══════════════════════════╝
🩵 _HatsuneBot - Sistema operando com sucesso._`;

    await sock.sendMessage(msg.key.remoteJid, { text: resposta }, { quoted: msg });
};

