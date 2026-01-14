export default {
  command: ['say', 'decir'],
  category: 'grupo',
  run: async (client, m, args, usedPrefix, command) => {
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null
    const groupParticipants = groupMetadata?.participants || []
    const allMentions = groupParticipants.map(p => client.decodeJid(p.jid || p.id || p.lid || p.phoneNumber)).filter(Boolean)
    const userText = (args.join(' ') || '').trim()
    const src = m.quoted || m
    const hasImage = Boolean(src.message?.imageMessage || src.mtype === 'imageMessage')
    const hasVideo = Boolean(src.message?.videoMessage || src.mtype === 'videoMessage')
    const hasAudio = Boolean(src.message?.audioMessage || src.mtype === 'audioMessage')
    const hasSticker = Boolean(src.message?.stickerMessage || src.mtype === 'stickerMessage')
    const isQuoted = Boolean(m.quoted)
    const originalText = (src.caption || src.text || src.body || '').trim()
    const textToCheck = (userText || originalText || '').trim()
    const explicitMentions = allMentions.filter(jid => textToCheck.includes(jid.split('@')[0]))
    try {
      const options = { quoted: null, mentions: explicitMentions.length ? explicitMentions : [] }
      if (hasImage || hasVideo) {
        const media = await src.download()
        if (hasImage) {
          return client.sendMessage(m.chat, { image: media, caption: textToCheck || '', ...options })
        } else {
          return client.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', caption: textToCheck || '', ...options })
        }
      }
      if (hasAudio) {
        const media = await src.download()
        return client.sendMessage(m.chat, { audio: media, mimetype: 'audio/mp4', fileName: 'hidetag.mp3', ...options })
      }
      if (hasSticker) {
        const media = await src.download()
        return client.sendMessage(m.chat, { sticker: media, ...options })
      }
      if (textToCheck) {
        return client.sendMessage(m.chat, { text: textToCheck, ...options })
      }
      return m.reply('《✧》 Por favor, escribe el texto que deseas repetir.')
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}