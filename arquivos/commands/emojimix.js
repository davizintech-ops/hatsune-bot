const axios = require('axios');

module.exports = async (sock, msg, args, config) => {
    // Une os argumentos e remove espaços em branco
    const input = args.join("").replace(/\s+/g, '');

    // Tenta separar por "+" ou pega os dois primeiros caracteres se o usuário mandou colado (ex: 😭🔥)
    let emoji1, emoji2;
    if (input.includes("+")) {
        [emoji1, emoji2] = input.split("+");
    } else {
        // Usa Array.from para separar emojis corretamente (evita quebrar surrogate pairs do JS)
        const emojiArray = Array.from(input);
        if (emojiArray.length >= 2) {
            emoji1 = emojiArray[0];
            emoji2 = emojiArray[1];
        }
    }

    // Validação se os dois emojis foram capturados
    if (!emoji1 || !emoji2) {
        return await sock.sendMessage(msg.key.remoteJid, { 
            text: "⚠️ *Erro:* Use o formato correto.\nExemplo: `?emojimix 😭+🔥` ou `?emojimix 😭🔥`" 
        });
    }

    try {
        // Reação de carregamento
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "⏳", key: msg.key } });

        // Codifica os emojis para o formato correto de URL (Percent-encoding)
        const e1 = encodeURIComponent(emoji1);
        const e2 = encodeURIComponent(emoji2);

        // Usando uma API pública estável que aceita os emojis diretamente na URL
        const apiUrl = `https://tenor.googleapis.com/v2/kitchen?emoji1=${e1}&emoji2=${e2}`;
        
        // Faz a requisição na API
        const response = await axios.get(apiUrl);
        
        // A API do Tenor/Google Kitchen retorna um JSON com a URL da imagem correspondente
        if (response.data && response.data.url) {
            const imageUrl = response.data.url;

            // Envia a imagem combinada
            await sock.sendMessage(msg.key.remoteJid, {
                image: { url: imageUrl },
                caption: `┌───「 *EMOJIMIX* 」\n│\n│ 🎭 *COMBINAÇÃO:* ${emoji1} + ${emoji2}\n│ ✅ *STATUS:* Sucesso!\n│\n└──────────────`
            });
            
            // Remove a reação de carregamento ou troca por sucesso
            await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });
        } else {
            throw new Error("Combinação não encontrada");
        }

    } catch (e) {
        // Se der erro (ex: a combinação não existe no banco do Google)
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "❌", key: msg.key } });
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⚠️ *Erro:* O Google não possui uma combinação para ${emoji1} + ${emoji2}. Tente outros emojis!` 
        });
    }
};
