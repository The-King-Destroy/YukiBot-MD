import fs from 'fs'

export default {
  command: ['sticker', 's'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {      
      const quoted = m.quoted ? m.quoted : m
      const mime = (quoted.msg || quoted).mimetype || ''      
      let user = globalThis.db.data.users[m.sender] || {}
      const name = user.name
      let texto1 = user.metadatos || `ʏᴜᴋɪ 🧠 Wᴀʙᴏᴛ'ꜱ`
      let texto2 = user.metadatos2 || `@${name}`     
      let filteredText = args.join(' ').trim()
      let marca = filteredText.split(/[\u2022|]/).map(part => part.trim())
      let pack = marca[0] || texto1
      let author = marca.length > 1 ? marca[1] : texto2      
      if (/image/.test(mime)) {
        let buffer = await quoted.download()
        const tmpFile = `./tmp-${Date.now()}.jpg`
        await fs.writeFileSync(tmpFile, buffer)
        let encmedia = await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: pack, author: author })
        await fs.unlinkSync(tmpFile)        
      } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 20) {
          return m.reply('《✧》 El video no puede durar más de 20 segundos')
        }
        let buffer = await quoted.download()
        let encmedia = await client.sendVideoAsSticker(m.chat, buffer, m, { packname: pack, author: author })        
      } else {
        return client.reply(m.chat, '《✧》 Por favor, envía una imagen o video para hacer un sticker.', m)
      }
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}