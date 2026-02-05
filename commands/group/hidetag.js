export default {
  command: ['hidetag', 'tag'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null
    const groupParticipants = groupMetadata?.participants || []
    const mentions = groupParticipants.map(p => p.jid || p.id || p.lid || p.phoneNumber).filter(Boolean).map(id => client.decodeJid(id))
    const userText = (args.join(' ') || '').trim()
    const src = m.quoted || m
    const hasImage = Boolean(src.message?.imageMessage || src.mtype === 'imageMessage' || src.mimetype === 'image' || src.mediaType === 'image')
    const hasVideo = Boolean(src.message?.videoMessage || src.mtype === 'videoMessage' || src.mimetype === 'video' || src.mediaType === 'video')
    const hasAudio = Boolean(src.message?.audioMessage || src.mtype === 'audioMessage' || src.mimetype === 'audio' || src.mediaType === 'audio')
    const hasSticker = Boolean(src.message?.stickerMessage || src.mtype === 'stickerMessage' || src.mimetype === 'sticker' || src.mediaType === 'sticker')
    const isQuoted = Boolean(m.quoted)
    const originalText = (src.caption || src.text || src.body || '').trim()
    try {
      if (hasImage || hasVideo) {
        const media = await src.download()
        const options = { quoted: null, mentions }
        if (isQuoted) {
          if (hasImage) {
            return client.sendMessage(m.chat, { image: media, ...(originalText ? { caption: originalText } : {}), ...options })
          } else {
            return client.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', ...(originalText ? { caption: originalText } : {}), ...options })
          }
        } else {
          if (hasImage) {
            return client.sendMessage(m.chat, { image: media, ...(userText ? { caption: userText } : {}), ...options })
          } else {
            return client.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', ...(userText ? { caption: userText } : {}), ...options })
          }
        }
      }
      if (hasAudio) {
        const media = await src.download()
        return client.sendMessage(m.chat, { audio: media, mimetype: 'audio/mp4', fileName: 'hidetag.mp3', mentions }, { quoted: null })
      }
      if (hasSticker) {
        const media = await src.download()
        return client.sendMessage(m.chat, { sticker: media, mentions }, { quoted: null })
      }
      if (isQuoted && originalText) {
      return client.sendMessage(m.chat, { text: originalText, mentions }, { quoted: null })
      }
      if (userText) {
      return client.sendMessage(m.chat, { text: userText, mentions }, { quoted: null })
      }
      return m.reply(`《✧》 *Ingresa* un texto o *responde* a uno`)
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}