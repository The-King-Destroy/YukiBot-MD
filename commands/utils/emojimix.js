import fetch from 'node-fetch'
import fs from 'fs'

const fetchJson = (url, options) =>
  new Promise((resolve, reject) => {
    fetch(url, options).then(res => res.json()).then(json => resolve(json)).catch(err => reject(err))
  })

export default {
  command: ['emojimix'],
  category: 'sticker',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!args[0]) return m.reply(`《✧》 Ingresa 2 emojis para combinar.\n> Ejemplo: *${usedPrefix + command}* 👻+👀`)
      let [emoji1, emoji2] = text.split`+`
      await m.react('🕒')
      let user = globalThis.db.data.users[m.sender] || {}
      const name = user.name || m.sender.split('@')[0]
      let texto1 = user.metadatos || `ʏᴜᴋɪ 🧠 Wᴀʙᴏᴛ'ꜱ`
      let texto2 = user.metadatos2 || `@${name}`
      const res = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
      if (!res.results || res.results.length === 0) throw new Error('《✧》 No se encontraron stickers para esos emojis.')
      for (let result of res.results) {
        const tmpFile = `./tmp-${Date.now()}.webp`
        const buffer = await (await fetch(result.url)).arrayBuffer()
        await fs.writeFileSync(tmpFile, Buffer.from(buffer))
        await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: texto1, author: texto2 })
        await fs.unlinkSync(tmpFile)
      }
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}