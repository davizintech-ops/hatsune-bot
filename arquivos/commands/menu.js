module.exports = async (sock, msg) => {

    const {
        generateWAMessageFromContent,
        prepareWAMessageMedia
    } = require("@whiskeysockets/baileys");

    const media = await prepareWAMessageMedia(
        {
            image: require("fs").readFileSync(
                "./arquivos/media/menu.jpg"
            )
        },
        {
            upload: sock.waUploadToServer
        }
    );


    const mensagem = generateWAMessageFromContent(
        msg.key.remoteJid,
        {
            viewOnceMessage: {
                message: {

                    interactiveMessage: {

                        body: {
                            text: "🤖 HatsuneBot\nEscolha uma opção"
                        },

                        footer: {
                            text: "HatsuneBot v3"
                        },

                        carouselMessage: {

                            cards: [

                                {
                                    header: {
                                        title: "🏓 Ping",
                                        hasMediaAttachment: true,
                                        imageMessage: media.imageMessage
                                    },

                                    body: {
                                        text: "Veja a velocidade do bot"
                                    },

                                    nativeFlowMessage: {
                                        buttons: [
                                            {
                                                name: "quick_reply",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "Ping",
                                                    id: "?ping"
                                                })
                                            }
                                        ]
                                    }
                                },


                                {
                                    header: {
                                        title: "📚 Menu",
                                        hasMediaAttachment: true,
                                        imageMessage: media.imageMessage
                                    },

                                    body: {
                                        text: "Lista de comandos"
                                    },

                                    nativeFlowMessage: {
                                        buttons: [
                                            {
                                                name: "quick_reply",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "📚 todos os comandos",
                                                    id: "?menup"
                                                })
                                            }
                                        ]
                                    }
                                },


                                {
                                    header: {
                                        title: "👑 Dono",
                                        hasMediaAttachment: true,
                                        imageMessage: media.imageMessage
                                    },

                                    body: {
                                        text: "Informações do criador"
                                    },

                                    nativeFlowMessage: {
                                        buttons: [
                                            {
                                                name: "quick_reply",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "Dono",
                                                    id: "?dono"
                                                })
                                            }
                                        ]
                                    }
                                }

                            ]
                        }
                    }
                }
            }
        },
        {
            userJid: sock.user.id,
            quoted: msg
        }
    );


    await sock.relayMessage(
        msg.key.remoteJid,
        mensagem.message,
        {
            messageId: mensagem.key.id
        }
    );

};
