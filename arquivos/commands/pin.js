// ======================================
// PIN.JS - PARTE 1/4
// ======================================

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const {
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = require("@whiskeysockets/baileys");

module.exports = async (sock, msg, args) => {

    const config = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../config.json"),
            "utf8"
        )
    );

    const from = msg.key.remoteJid;

    if (!args.length) {
        return sock.sendMessage(from, {
            text:
`📌 Uso:

${config.prefix}pin <pesquisa> [quantidade]

Exemplo:
${config.prefix}pin gato 6`
        }, {
            quoted: msg
        });
    }

    const dados = [...args];

    let limite = 6;

    if (/^\d+$/.test(dados[dados.length - 1])) {
        limite = Number(dados.pop());

        if (limite < 1) limite = 1;
        if (limite > 10) limite = 10;
    }

    const pesquisa = dados.join(" ");

    await sock.sendMessage(from, {
        react: {
            text: "🔎",
            key: msg.key
        }
    });

    try {

        const { data } = await axios.get(
            "https://systemzone.store/api/pinterest",
            {
                params: {
                    q: pesquisa,
                    limit: 50
                },
                timeout: 120000
            }
        );

        const resultados = Array.isArray(data.results)
            ? data.results
            : [];

        if (!resultados.length) {

            await sock.sendMessage(from, {
                react: {
                    text: "❌",
                    key: msg.key
                }
            });

            return sock.sendMessage(from, {
                text: "Nenhuma imagem encontrada."
            }, {
                quoted: msg
            });
        }

        const cards = [];

// ======================================
// PIN.JS - PARTE 2/4
// ======================================

        for (let i = 0; i < Math.min(limite, resultados.length); i++) {

            const imagem = resultados[i]?.image_url;

            if (!imagem) continue;

            const media = await prepareWAMessageMedia(
                {
                    image: {
                        url: imagem
                    }
                },
                {
                    upload: sock.waUploadToServer
                }
            );

            cards.push({
                header: {
                    title: `📌 Pinterest • ${i + 1}/${Math.min(limite, resultados.length)}`,
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage
                },

                body: {
                    text: pesquisa
                },

                footer: {
                    text: config.botName
                },

                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🖼 Abrir imagem",
                                url: imagem
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📋 Copiar URL",
                                copy_code: imagem
                            })
                        }
                    ]
                }
            });

        }
// ======================================
// PIN.JS - PARTE 3/4
// ======================================

        const mensagem = generateWAMessageFromContent(
            from,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "📌 Pinterest"
                            },

                            body: {
                                text:
`🔎 Pesquisa: ${pesquisa}

🖼 Resultados: ${cards.length}`
                            },

                            footer: {
                                text: config.botName
                            },

                            carouselMessage: {
                                cards,
                                messageVersion: 1
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

// ======================================
// PIN.JS - PARTE 4/4
// ======================================

        await sock.relayMessage(
            from,
            mensagem.message,
            {
                messageId: mensagem.key.id
            }
        );

        await sock.sendMessage(from, {
            react: {
                text: "✅",
                key: msg.key
            }
        });

    } catch (err) {

        console.error("[PINTEREST]", err);

        await sock.sendMessage(from, {
            react: {
                text: "❌",
                key: msg.key
            }
        });

        await sock.sendMessage(from, {
            text: "❌ Erro ao buscar imagens do Pinterest."
        }, {
            quoted: msg
        });

    }

};
