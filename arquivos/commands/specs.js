const os = require('os');

module.exports = async (sock, msg) => {
    // 1. Coleta de dados completos
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    
    const cpuModel = os.cpus()[0].model;
    const cpuCores = os.cpus().length;
    const so = `${os.type()} ${os.release()} (${os.arch()})`;

    // 2. Montagem do estilo HatsuneBot com todos os campos
    const resposta = `
╔══〔 ⚙️ 𝗦𝗣𝗘𝗖𝗦 𝗗𝗢 𝗦𝗘𝗥𝗩𝗜𝗗𝗢𝗥 〕══╗
┃
┃ ➔ 𝗦𝗢: ${so}
┃ ➔ 𝗖𝗣𝗨: ${cpuModel}
┃ ➔ 𝗡𝘂́𝗰𝗹𝗲𝗼𝘀: ${cpuCores}
┃ ➔ 𝗥𝗔𝗠 𝗧𝗼𝘁𝗮𝗹: ${totalMem} GB
┃ ➔ 𝗥𝗔𝗠 𝗨𝘀𝗮𝗱𝗮: ${usedMem} GB
┃ ➔ 𝗥𝗔𝗠 𝗟𝗶𝘃𝗿𝗲: ${freeMem} GB
┃
╚═════════════════════════════╝
🩵 _HatsuneBot - Hardware monitorado._`;

    await sock.sendMessage(msg.key.remoteJid, { text: resposta }, { quoted: msg });
};

