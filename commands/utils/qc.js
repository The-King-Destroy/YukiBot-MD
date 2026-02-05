import axios from 'axios'
import fs from 'fs'

export default {
  command: ['qc'],
  category: 'sticker',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      let textFinal = args.join(' ') || m.quoted?.text
      if (!textFinal) return client.reply(m.chat, `《✧》 Ingresa un texto para crear el sticker.`, m)
      let target = m.quoted ? m.quoted.sender : m.sender
      const pp = await client.profilePictureUrl(target).catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
      const nombre = globalThis.db.data.users[target]?.name || target.split('@')[0]
      if (textFinal.length > 30) {
        await m.react('✖️')
        return client.reply(m.chat, `《✧》 El texto no puede tener más de 30 caracteres.`, m)
      }
      await m.react('🕒')
      const quoteObj = {
        type: 'quote',
        format: 'png',
        backgroundColor: '#000000',
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
          entities: [],
          avatar: true,
          from: { id: 1, name: nombre, photo: { url: pp } },
          text: textFinal,
          replyMessage: {}
        }]
      }
      const json = await axios.post('https://bot.lyo.su/quote/generate', quoteObj, { headers: { 'Content-Type': 'application/json' } })
      const buffer = Buffer.from(json.data.result.image, 'base64')
      let user = globalThis.db.data.users[m.sender] || {}
      const name = user.name || m.sender.split('@')[0]
      let texto1 = user.metadatos || `ʏᴜᴋɪ 🧠 Wᴀʙᴏᴛ'ꜱ`
      let texto2 = user.metadatos2 || `@${name}`
      const tmpFile = `./tmp-${Date.now()}.webp`
      await fs.writeFileSync(tmpFile, buffer)
      await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: texto1, author: texto2 })
      await fs.unlinkSync(tmpFile)
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}