/**
 * 🩵 HATSUNE BOT MD - SISTEMA ANTI-CRASH BLINDADO
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const readline = require('readline-sync');

process.on('uncaughtException', (err) => {
    console.error('\x1b[31m%s\x1b[0m', '🚨 [CRASH] Erro Crítico não tratado:', err.stack);
});

process.on('unhandledRejection', (reason) => {
    console.error('\x1b[33m%s\x1b[0m', '⚠️ [DEBUG] Rejeição não tratada:', reason);
});

async function iniciarBot() {

    const config = JSON.parse(
        fs.readFileSync('./config.json', 'utf8')
    );

    const { state, saveCreds } = await useMultiFileAuthState(
        `./${config.sessionName}`
    );

const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
});

if (!state.creds.registered) {
    const numero = readline.question(
        "📱 Digite seu número com DDI: "
    );

setTimeout(async () => {
    const code = await sock.requestPairingCode(numero);
    console.log("🔑 Código de pareamento:", code);
}, 3000);
};
sock.interactive = async function ({
    chat,
    title = "",
    text = "",
    footer = "",
    buttons = []
}) {

    const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

    const msg = generateWAMessageFromContent(
        chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: {
                            text
                        },
                        footer: {
                            text: footer
                        },
                        nativeFlowMessage: {
                            buttons: buttons.map(btn => ({
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: btn.text,
                                    id: btn.id
                                })
                            }))
                        }
                    }
                }
            }
        },
        {
            userJid: sock.user.id
        }
    );

    await sock.relayMessage(
        chat,
        msg.message,
        {
            messageId: msg.key.id
        }
    );
};

    sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        console.log("❌ Conexão fechada");
        console.log(lastDisconnect?.error);

        const shouldReconnect =
            lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
            console.log("🔄 Tentando reconectar...");
            setTimeout(() => iniciarBot(), 3000);
        }

    } else if (connection === 'open') {
        console.log('\x1b[32m%s\x1b[0m',
            `🚀 [${config.botName}] CONECTADO COM SUCESSO!`
        );

        console.log('\x1b[34m%s\x1b[0m',
            `👑 Dono: ${config.ownerName} (${config.ownerNumber})`
        );

        console.log('\x1b[34m%s\x1b[0m',
            `⚡ Prefixo ativo: ${config.prefix}`
        );
    }
});

    sock.ev.on('messages.upsert', async ({ messages }) => {

        const msg = messages[0];

        if (!msg.message || msg.key.fromMe) return;

        console.log("TIPO:", Object.keys(msg.message));
        console.log(JSON.stringify(msg.message, null, 2));

        const type = Object.keys(msg.message)[0];

const body =
    type === 'conversation'
        ? msg.message.conversation
        : type === 'extendedTextMessage'
            ? msg.message.extendedTextMessage.text
            : type === 'templateButtonReplyMessage'
                ? msg.message.templateButtonReplyMessage.selectedId
                : '';

    const xpFile = "./arquivos/database/xp.json";

    if (!fs.existsSync(xpFile)) {
        fs.writeFileSync(xpFile, "{}");
    }

    let xpData = JSON.parse(fs.readFileSync(xpFile));

    let user = msg.key.participant || msg.key.remoteJid;

    if (!xpData[user]) {
        xpData[user] = {
            xp: 0,
            level: 1
        };
    }

    let ganho = Math.floor(Math.random() * 10) + 5;

    xpData[user].xp += ganho;

    let novoNivel = Math.floor(xpData[user].xp / 100) + 1;

    if (novoNivel > xpData[user].level) {

        xpData[user].level = novoNivel;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text:
`🎉 Parabéns @${user.split("@")[0]}!

⬆️ Subiu de nível!
🏆 Nível: ${novoNivel}`,
                mentions: [user]
            }
        );
    }

    fs.writeFileSync(
        xpFile,
        JSON.stringify(xpData, null, 2)
    );


        if (body.toLowerCase() === 'oi' || body.toLowerCase() === 'olá') {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: 'oi delícia'
                },
                {
                    quoted: msg
                }
            );

        }


        if (body.toLowerCase() === 'bot' || body.toLowerCase() === 'bott') {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: 'oi delícia, oque vc quer?🤗'
                },
                {
                    quoted: msg
                }
            );

        }


        if (
            body.toLowerCase() === 'bot ruim' ||
            body.toLowerCase() === 'bot vei podi'
        ) {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                    'eiii, eu to sendo desenvolvido ainda! posso ter até uns bug!\nrelata com meu dono!\n+55 64 98115-2989'
                },
                {
                    quoted: msg
                }
            );

        }


        if (
            body.toLowerCase() === 'dono ruim' ||
            body.toLowerCase() === 'dono lixo'
        ) {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                    '🤬 - VAI TOMAR NO SEU CU SEU FILHA DA PUTA, PARE DE CHAMAR MEU DONO DE RUIM/LIXO AAAAA🤬🤬🤬🤬'
                },
                {
                    quoted: msg
                }
            );

        }


        if (body.toLowerCase().includes('kkkk')) {

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    react: {
                        text: '😂',
                        key: msg.key
                    }
                }
            );

        }

        if (body.startsWith(config.prefix)) {

            const command = body
                .slice(config.prefix.length)
                .trim()
                .split(/ +/)
                .shift()
                .toLowerCase();

            const args = body
                .trim()
                .split(/ +/)
                .slice(1);


            console.log(
                '\x1b[35m%s\x1b[0m',
                `📩 [COMANDO] "${config.prefix}${command}" executado por: ${msg.key.remoteJid}`
            );


            try {

                if (fs.existsSync(`./arquivos/commands/${command}.js`)) {

                    await require(
                        `./arquivos/commands/${command}.js`
                    )(sock, msg, args);

                }

            } catch (error) {

                console.error(
                    '\x1b[31m%s\x1b[0m',
                    `❌ [ERRO NO COMANDO ${command}]:`,
                    error
                );

            }

        }

    });

}

iniciarBot().catch(err =>
    console.log(
        '\x1b[31m%s\x1b[0m',
        '❌ Falha fatal ao iniciar o bot:',
        err
    )
);
