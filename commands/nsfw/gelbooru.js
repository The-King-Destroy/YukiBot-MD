import axios from 'axios'

export default {
  command: ['gelbooru', 'gbooru'],
  category: 'nsfw',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!globalThis.db.data.chats[m.chat]?.nsfw) return m.reply(`ꕥ El contenido *NSFW* está desactivado en este grupo.\n\nUn *administrador* puede activarlo con el comando:\n» *${usedPrefix}nsfw on*`)
      if (!args[0]) return client.reply(m.chat, `《✧》 Debes especificar tags para buscar\n> Ejemplo » *${usedPrefix + command} neko*`, m)
      await m.react('🕒')
      const tag = args[0].replace(/\s+/g, '_')
      const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tag)}&api_key=f965be362e70972902e69652a472b8b2df2c5d876cee2dc9aebc7d5935d128db98e9f30ea4f1a7d497e762f8a82f132da65bc4e56b6add0f6283eb9b16974a1a&user_id=1862243`
      const res = await axios.get(url)
      const data = res.data?.post || []
      const valid = data.map(i => i?.file_url).filter(u => typeof u === 'string' && /\.(jpe?g|png|gif|mp4)$/.test(u))
      const mediaList = [...new Set(valid)].sort(() => Math.random() - 0.5)
      if (!mediaList.length) return client.reply(m.chat, `《✧》 No se encontraron resultados para ${tag}`, m)
      const media = mediaList[Math.floor(Math.random() * mediaList.length)]
      const caption = `ꕥ Resultados para » ${tag}`
      if (media.endsWith('.mp4')) {
        await client.sendMessage(m.chat, { video: { url: media }, caption, mentions: [m.sender] })
      } else {
        await client.sendMessage(m.chat, { image: { url: media }, caption, mentions: [m.sender] })
      }
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}