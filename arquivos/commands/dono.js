module.exports = async (sock, msg) => {

    await sock.sendMessage(
        msg.key.remoteJid,
        {
            image: {
                url: "./arquivos/media/menu.jpg"
            },

            caption:
`👑 *Dono do HatsuneBot*

👤 Nome: Davizin
🤖 Projeto: HatsuneBot
💻 Desenvolvedor de bots e projetos em Node.js

🌐 GitHub:
https://github.com/davizintech-ops

🚀 Projetos:
• yesPipe
• meishobot

Obrigado por usar o HatsuneBot!`,

        },
        {
            quoted: msg
        }
    );

};
