const fs = require("fs");

// Função para calcular o tempo da TV Box
function getUptime() {
    try {
        const uptimeSeconds = parseFloat(
            fs.readFileSync('/proc/uptime', 'utf8').split(' ')[0]
        );

        const d = Math.floor(uptimeSeconds / 86400);
        const h = Math.floor((uptimeSeconds % 86400) / 3600);
        const m = Math.floor((uptimeSeconds % 3600) / 60);

        return `${d}d ${h}h ${m}m`;

    } catch {
        return "indisponível";
    }
}


module.exports = async (sock, msg) => {

    const config = JSON.parse(
        fs.readFileSync('./config.json', 'utf8')
    );

    const p = config.prefix;
    const uptime = getUptime();


    const menuTexto = `
┏═•✭･ﾟ✧*･ﾟ| ⊱✿⊰ |*✭˚･ﾟ✧･ﾟ•═┓
┣⋆⃟ۣۜ᭪➣ 𖡦 𝐌𝐄𝐍𝐔 𝐃𝐎 𝐇𝐀𝐓𝐒𝐔𝐍𝐄𝐁𝐎𝐓
┣⋆⃟ۣۜ᭪➣ 🖥️ Uptime: ${uptime}
┗═•✭･ﾟ✧*･ﾟ| ⊱✿⊰ |*✭˚･ﾟ✧･ﾟ•═┛

╭━━─ ≪ 📥 DOWNLOAD ≫ ─━━╮
┃☆ ${p}play
┃☆ ${p}playvid
╰━━─ ≪ •❈• ≫ ─━━╯

╭━━─ ≪ 👑 GRUPO / ADMIN ≫ ─━━╮
┃☆ ${p}ban
┃☆ ${p}promover
┃☆ ${p}rebaixar
┃☆ ${p}mute
┃☆ ${p}unmute
┃☆ ${p}grupo
┃☆ ${p}setname
┃☆ ${p}setregras
┃☆ ${p}linkgp
┃☆ ${p}delete
╰━━─ ≪ •❈• ≫ ─━━╯

╭━━─ ≪ ⚙️ UTILIDADES ≫ ─━━╮
┃☆ ${p}menu
┃☆ ${p}dono
┃☆ ${p}ping
┃☆ ${p}exec
┃☆ ${p}specs
┃☆ ${p}rank ⭐
╰━━─ ≪ •❈• ≫ ─━━╯

╭━━─ ≪ 🎮 DIVERSÃO ≫ ─━━╮
┃☆ ${p}abracar
┃☆ ${p}beijar
┃☆ ${p}cutucar
┃☆ ${p}sticker
┃☆ ${p}emojimix
┃☆ ${p}perfil
┃☆ ${p}gado
┃☆ ${p}feio
┃☆ ${p}ship
┃☆ ${p}sorteio
╰━━─ ≪ •❈• ≫ ─━━╯

┏═•✭･ﾟ✧*･ﾟ| ⊱✿⊰ |*✭˚･ﾟ✧･ﾟ•═┓
✰ۜۜ͜͡ ${config.botName} ✿
┗═•✭･ﾟ✧*･ﾟ| ⊱✿⊰ |*✭˚･ﾟ✧･ﾟ•═┛
`;


    try {

        if (fs.existsSync('./arquivos/media/menu.jpg')) {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    image: fs.readFileSync('./arquivos/media/menu.jpg'),
                    caption: menuTexto
                },
                {
                    quoted: msg
                }
            );

        } else {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: menuTexto
                },
                {
                    quoted: msg
                }
            );
        }


    } catch (e) {

        console.log("Erro no menu:", e);

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: menuTexto
            },
            {
                quoted: msg
            }
        );
    }


    await sock.sendMessage(
        msg.key.remoteJid,
        {
            react: {
                text: "⭐",
                key: msg.key
            }
        }
    );

};
