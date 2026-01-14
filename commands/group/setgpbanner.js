export default {
  command: ['setgpbanner'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image/.test(mime))
      return m.reply('《✧》 Te faltó la imagen para cambiar el perfil del grupo.')
    const img = await q.download()
    if (!img) return m.reply('《✧》 No se pudo descargar la imagen.')
    try {
      await client.updateProfilePicture(m.chat, img)
      m.reply('✿ La imagen del grupo se actualizó con éxito.')
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
