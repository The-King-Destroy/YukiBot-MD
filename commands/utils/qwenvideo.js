import fetch from 'node-fetch'
import axios from 'axios'

export default {
  command: ['qwenvideo'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isPremiumBot = global.db.data.settings[botId]?.botprem === true
    const isModBot = global.db.data.settings[botId]?.botmod === true
    if (!isOficialBot && !isPremiumBot && !isModBot) {
      return client.reply(m.chat, `《✧》El comando *${command}* no está disponible en *Sub-Bots.*`, m)
    }
    const text = args.join(' ').trim()
    if (!text) {
      return m.reply(`《✧》 Escriba una *petición* para generar el *video.*`)
    }
    try {
      const { key } = await client.sendMessage(m.chat, { text: `ꕥ *Qwen Video* está generando tu video...` }, { quoted: m })
      await m.react('🕒')
      const taskRes = await fetch(`https://api.soymaycol.icu/ai-qwen-task?q=${encodeURIComponent(text)}&apikey=soymaycol%3C3`)
      const taskJson = await taskRes.json()
      if (!taskJson?.status || !taskJson?.check_url) {
        throw new Error('task_failed')
      }
      const checkUrl = taskJson.check_url
      let resultUrl = null
      for (let i = 0; i < 90; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const checkRes = await fetch(checkUrl)
        const checkJson = await checkRes.json()
        if (checkJson?.status && checkJson?.state === 'success' && checkJson?.result?.original_url) {
          resultUrl = checkJson.result.original_url
          break
        }
        if (!checkJson?.status) {
          throw new Error('process_failed')
        }
      }
      if (!resultUrl) {
        throw new Error('timeout')
      }
      const videoRes = await axios.get(resultUrl, { responseType: 'arraybuffer' })
      await client.sendMessage(m.chat, { video: Buffer.from(videoRes.data), caption: `《✧》 *Qwen Video* generado correctamente.` }, { quoted: m })
      await client.sendMessage(m.chat, { text: `ꕥ *Qwen Video* listo.`, edit: key })
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      await client.reply(m.chat, `《✧》 Ocurrió un *error* al generar el video. Inténtalo más tarde.`, m)
    }
  },
            }
