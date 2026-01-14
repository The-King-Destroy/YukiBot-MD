import axios from 'axios';
import path from 'path';
import { getBuffer } from '../../lib/message.js';
import { lookup } from 'mime-types';

export default {
  command: ['mediafire', 'mf'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ')
    if (!text) {
      return m.reply('《✧》 Por favor, ingresa el enlace de Mediafire o una palabra clave.')
      }
    try {
      if (!/^https:\/\/www\.mediafire\.com\//i.test(text)) {
        const res = await axios.get(`${global.APIs.stellar.url}/search/mediafire?query=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}`)
        const data = res.data
        if (!data?.status || !data.results?.length) {
          return m.reply('《✧》 No se encontraron resultados para tu búsqueda.')
        }
        let caption = `✰ ᩧ　𓈒　ׄ　𝖬𝖾𝖽𝗂𝖺𝖥𝗂𝗋𝖾　ׅ　✿\n\n`
        caption += `𖣣ֶㅤ֯⌗ ❀  ⬭ *Resultados encontrados* › ${data.results.length}\n\n`
        data.results.forEach((r, i) => {
          caption += `﹙${i + 1}﹚ *Nombre* › ${r.filename}\n`
          caption += `﹙${i + 1}﹚ *Peso* › ${r.filesize}\n`
          caption += `﹙${i + 1}﹚ *Enlace* › ${r.url}\n`
          caption += `﹙${i + 1}﹚ *Fuente* › ${r.source_title}\n\n`
        })
        return m.reply(caption)
      }
      const result = await downloadMediafire(text)
      if (!result) return m.reply(`《✧》 El enlace ingresado es inválido.`)
      const { title, dl } = result
      const ext = path.extname(title)
      const tipo = lookup(ext.toLowerCase()) || 'application/octet-stream'
      const info = `✰ ᩧ　𓈒　ׄ　𝖬𝖾𝖽𝗂𝖺𝖥𝗂𝗋𝖾　ׅ　✿\n\n` +
        `ׄ ﹙ׅ✿﹚ּ *Nombre* › ${title}\n` +
        `ׄ ﹙ׅ✿﹚ּ *Tipo* › ${tipo}\n\n${dev}`
      await client.sendContextInfoIndex(m.chat, info, {}, m, true, null, {
        banner: 'https://cdn.sockywa.xyz/files/1755745696353.jpeg',
        title: '𖹭  ׄ  ְ ✿ Mediafire ✩',
        body: '✰ Descarga De MF',
        redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link,
      })
      await client.sendMessage(m.chat, { document: { url: dl }, mimetype: tipo, fileName: title }, { quoted: m })
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}

async function downloadMediafire(url) {
  const dlApis = [`${global.APIs.stellar.url}/dl/mediafire?url=${encodeURIComponent(url)}&key=${global.APIs.stellar.key}`, `${global.APIs.stellar.url}/dl/mediafirev2?url=${encodeURIComponent(url)}&key=${global.APIs.stellar.key}`, `${global.APIs.nekolabs.url}/downloader/mediafire?url=${encodeURIComponent(url)}`, `${global.APIs.apifaa.url}/faa/mediafire?url=${encodeURIComponent(url)}`, `${global.APIs.delirius.url}/download/mediafire?url=${encodeURIComponent(url)}`]
  for (const endpoint of dlApis) {
    try {
      const res = await axios.get(endpoint)
      const data = res.data
      if (data?.status && data.data?.[0]?.directDownload) {
        return { title: data.data[0].filename || 'archivo', dl: data.data[0].directDownload }
      }
      if (data?.status && data.result?.link) {
        return { title: data.result.title?.trim() || 'archivo', dl: data.result.link }
      }
      if (data?.success && data.result?.download_url) {
        return { title: data.result.filename, dl: data.result.download_url }
      }
      if (data?.status && data.result?.download_url) {
        return { title: data.result.filename, dl: data.result.download_url }
      }
      if (data?.status && Array.isArray(data.data) && data.data.length > 0) {
        const file = data.data[0]
        return { title: file.filename, dl: file.link }
      }
    } catch {}
  }
  return null
}
