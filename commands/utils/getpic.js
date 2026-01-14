import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['pfp', 'getpic'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : m.quoted ? m.quoted.sender : false
    const who = await resolveLidToRealJid(who2, client, m.chat);
    if (!who2) return m.reply(`《✧》 Etiqueta o menciona al usuario del que quieras ver su foto de perfil.`)
    try {
      const img = await client.profilePictureUrl(who, 'image').catch(() => null)
      if (!img)
        return client.sendMessage(m.chat, { text: `《✧》 No se pudo obtener la foto de perfil de @${who.split('@')[0]}.`, mentions: [who] }, { quoted: m })
      await client.sendMessage(m.chat, { image: { url: img }, caption: null }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
