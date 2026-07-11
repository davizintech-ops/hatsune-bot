module.exports = async (sock, msg) => {
    const target = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.key.participant;
    const pp = await sock.profilePictureUrl(target, 'image').catch(() => 'https://i.ibb.co/0J52w2f/avatar.jpg');
    await sock.sendMessage(msg.key.remoteJid, { image: { url: pp }, caption: '📸 pfp roubada com sucesso!!' });
};

