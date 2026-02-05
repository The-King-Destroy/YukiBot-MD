import fs from 'fs'
import exif from '../../lib/exif.js'
const { writeExif } = exif

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
      let urlArg = null
      let argsWithoutUrl = []      
      for (let arg of args) {
        if (isUrl(arg)) {
          urlArg = arg
        } else {
          argsWithoutUrl.push(arg)
        }
      }      
      let filteredText = argsWithoutUrl.join(' ').trim()
      let marca = filteredText.split(/[\u2022|]/).map(part => part.trim())
      let pack = marca[0] || texto1
      let author = marca.length > 1 ? marca[1] : texto2    
      if (/image/.test(mime) || /webp/.test(mime)) {
        let buffer = await quoted.download()
        const isWebpAnimated = /webp/.test(mime) && buffer.toString('hex', 0, 4) === '52494646'    
        if (isWebpAnimated) {
          const media = { mimetype: 'webp', data: buffer };
          const metadata = { packname: pack, author: author, categories: [''] };
          const stickerPath = await writeExif(media, metadata);
          await client.sendMessage(m.chat, { sticker: { url: stickerPath }}, { quoted: m });
          await fs.unlinkSync(stickerPath)
        } else {
          const tmpFile = `./tmp-${Date.now()}.webp`
          await fs.writeFileSync(tmpFile, buffer)
          await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: pack, author: author })
          await fs.unlinkSync(tmpFile)
        }        
      } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 20) return m.reply('《✧》 El video no puede ser muy largo')
        let buffer = await quoted.download()
        const tmpFile = `./tmp-video-${Date.now()}.mp4`
        await fs.writeFileSync(tmpFile, buffer)
        await client.sendVideoAsSticker(m.chat, tmpFile, m, { packname: pack, author: author })
        await fs.unlinkSync(tmpFile)        
      } else if (urlArg) {
        const url = urlArg    
        if (!url.match(/\.(jpe?g|png|gif|webp|mp4|mov|avi|mkv|webm)$/i)) {
          return client.reply(m.chat, '《✧》 La URL debe ser de una imagen (jpg, png, gif, webp) o video (mp4, mov, avi, mkv, webm)', m)
        }        
        const response = await fetch(url)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        if (url.match(/\.(jpe?g|png|gif|webp)$/i)) {
          const isWebpAnimated = url.match(/\.webp$/i) && buffer.toString('hex', 0, 4) === '52494646'
          
          if (isWebpAnimated) {
            const media = { mimetype: 'webp', data: buffer };
            const metadata = { packname: pack, author: author, categories: [''] };
            const stickerPath = await writeExif(media, metadata);
            await client.sendMessage(m.chat, { sticker: { url: stickerPath }}, { quoted: m });
            await fs.unlinkSync(stickerPath)
          } else {
            const tmpFile = `./tmp-url-${Date.now()}.webp`
            await fs.writeFileSync(tmpFile, buffer)
            await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: pack, author: author })
            await fs.unlinkSync(tmpFile)
          }
        } else if (url.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
          const tmpFile = `./tmp-video-url-${Date.now()}.mp4`
          await fs.writeFileSync(tmpFile, buffer)
          await client.sendVideoAsSticker(m.chat, tmpFile, m, { packname: pack, author: author })
          await fs.unlinkSync(tmpFile)
        }      
      } else {
        return client.reply(m.chat, `《✧》 Por favor, envía una imagen, video, sticker o URL para hacer un sticker.\n> Usa *${usedPrefix + command} -list* para ver las opciones`, m)
      }
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png|webp|mp4|mov|avi|mkv|webm)/, 'gi'))
}
