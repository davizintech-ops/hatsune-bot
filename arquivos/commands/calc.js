module.exports = async (sock, msg, args) => {

    if (!args.length) {
        return sock.sendMessage(msg.key.remoteJid,{
            text:"Ex: .calc 2+2"
        },{quoted:msg});
    }

    try{

        const resultado = Function(
            `'use strict'; return (${args.join(" ")})`
        )();

        await sock.sendMessage(msg.key.remoteJid,{
            text:`🧮 Resultado: ${resultado}`
        },{quoted:msg});

    }catch{

        await sock.sendMessage(msg.key.remoteJid,{
            text:"❌ Conta inválida"
        },{quoted:msg});

    }

}
