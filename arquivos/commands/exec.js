const { spawn } = require('child_process');

module.exports = async (sock, msg, args, config) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    
    // (Mantenha aqui a sua lógica de verificação de admin se quiser)
    
    const comando = args.join(' ');
    if (!comando) return await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Digite um comando." });

    // 1. Envia a primeira mensagem
    let sentMsg = await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Iniciando..." });
    let output = "--- EXECUÇÃO AO VIVO ---\n";

    // 2. Usa o spawn para ler o fluxo de dados em tempo real
    const proc = spawn(comando, { shell: true });

    // Função interna para atualizar a mensagem periodicamente
    const updateMsg = async (newData) => {
        output += newData;
        // Limita o tamanho para não estourar o limite do WhatsApp
        if (output.length > 2000) output = output.slice(-2000); 
        
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `\`\`\`${output}\`\`\``, 
            edit: sentMsg.key 
        });
    };

    proc.stdout.on('data', (data) => updateMsg(data.toString()));
    proc.stderr.on('data', (data) => updateMsg(`\n⚠️ ERRO: ${data.toString()}`));

    proc.on('close', (code) => {
        updateMsg(`\n\n✅ FINALIZADO (Código: ${code})`);
    });
};

