import yts from 'yt-search';
import {getBuffer} from '../../lib/message.js';

export default {
  command: ['ytsearch', 'search'],
  category: 'internet',
  run: async (client, m, args) => {
    if (!args || !args[0]) {
      return m.reply('《✧》 Por favor, Ingrese el título de un vídeo.')
    }
    const ress = await yts(`${args[0]}`)
    const armar = ress.all
    const Ibuff = await getBuffer(armar[0].image)
    let teks2 = armar.map((v) => {
        switch (v.type) {
          case 'video':
            return `➩ *Título ›* *${v.title}* 

> ⴵ *Duración ›* ${v.timestamp}
> ❖ *Subido ›* ${v.ago}
> ✿ *Vistas ›* ${v.views}
> ❒ *Url ›* ${v.url}`.trim()
          case 'channel':
            return `
> ❖ Canal › *${v.name}*
> ❒ Url › ${v.url}
> ❀ Subscriptores › ${v.subCountLabel} (${v.subCount})
> ✿ Videos totales › ${v.videoCount}`.trim()
        }}).filter((v) => v).join('\n\n╾۪〬─ ┄۫╌ ׄ┄┈۪ ─〬 ׅ┄╌ ۫┈ ─ׄ─۪〬 ┈ ┄۫╌ ┈┄۪ ─ׄ〬╼\n\n')
    client.sendMessage(m.chat, { image: Ibuff, caption: teks2 }, { quoted: m }).catch((e) => {
      m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    })
  },
};