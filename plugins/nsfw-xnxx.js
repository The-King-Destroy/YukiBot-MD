import fetch from 'node-fetch'
import axios from 'axios'
import cheerio from 'cheerio'

const handler = async (m, { text, conn, usedPrefix }) => {
if (!db.data.chats[m.chat].nsfw && m.isGroup) {
return m.reply(`ꕥ El contenido *NSFW* está desactivado en este grupo.\n\nUn *administrador* puede activarlo con el comando:\n» *${usedPrefix}nsfw on*`)
}
if (!text) {
return m.reply('❀ Por favor, ingresa el título o URL del video de *(xnxx)*.')
}
conn.xnxx = conn.xnxx || {}
const isUrl = text.includes('xnxx.com')
if (isUrl) {
try {
await m.react('🕒')
const res = await xnxxdl(text)
const { dur, qual, views } = res.result.info
const txt = `*乂 ¡XNXX - DOWNLOAD! 乂*

≡ Título : ${res.result.title}
≡ Duración : ${dur || 'Desconocida'}
≡ Calidad : ${qual || 'Desconocida'}
≡ Vistas : ${views || 'Desconocidas'}`
const dll = res.result.files.high || res.result.files.low
await conn.sendFile(m.chat, dll, res.title + '.mp4', txt, m)
await m.react('✔️')
} catch (e) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n` + e, m)
}
return
}
const res = await search(encodeURIComponent(text))
await m.react('🕒')
if (!res.result?.length) return m.reply('ꕥ No se encontraron resultados.')
await m.react('✔️')
const list = res.result.slice(0, 10).map((v, i) => `*${i + 1}*\n≡ Título : *${v.title}*\n≡ Link : ${v.link}`).join('\n\n')
const caption = `*乂 ¡XNXX - SEARCH! 乂*

${list}

> » Responde con el número + n para descargar uno de los siguientes vídeos o bien, usa directamente la URL.`
const { key } = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
conn.xnxx[m.sender] = {
result: res.result,
key,
downloads: 0,
timeout: setTimeout(() => delete conn.xnxx[m.sender], 120_000)
}}
handler.before = async (m, { conn }) => {
conn.xnxx = conn.xnxx || {}
const session = conn.xnxx[m.sender]
if (!session || !m.quoted || m.quoted.id !== session.key.id) return
const n = parseInt(m.text.trim())
if (isNaN(n) || n < 1 || n > session.result.length) {
await m.reply('ꕥ Por favor, ingresa un número válido.')
return
}
try {
await m.react('🕒')
const link = session.result[n - 1].link
const res = await xnxxdl(link)
const { dur, qual, views } = res.result.info
const txt = `*乂 ¡XNXX - DOWNLOAD! 乂*

≡ Título : ${res.result.title}
≡ Duración : ${dur || 'Desconocida'}
≡ Calidad : ${qual || 'Desconocida'}
≡ Vistas : ${views || 'Desconocidas'}`
const dll = res.result.files.high || res.result.files.low
await conn.sendFile(m.chat, dll, res.title + '.mp4', txt, m)
await m.react('✔️')
} catch (e) {
await m.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n` + e, m)
await m.react('✖️')
} finally {
session.downloads++
if (session.downloads >= 5) {
clearTimeout(session.timeout)
delete conn.xnxx[m.sender]}}}

handler.command = ['xnxxsearch', 'xnxxdl', 'xnxx']
handler.tags = ['download']
handler.help = ['xnxx']
handler.group = true

export default handler

function parseInfo(infoStr = '') {
const lines = infoStr.split('\n').map(v => v.trim()).filter(Boolean)
const [line1, line2] = lines
let dur = '', qual = '', views = ''
if (line1) {
const durMatch = line1.match(/(\d+\s?min)/i)
dur = durMatch ? durMatch[1] : ''
}
if (line2) {
const parts = line2.split('-').map(v => v.trim()).filter(Boolean)
if (parts.length >= 2) {
qual = parts[0]
views = parts[1]
} else if (parts.length === 1) {
qual = parts[0]}}
return { dur, qual, views }
}
async function xnxxdl(URL) {
return new Promise((resolve, reject) => {
fetch(`${URL}`, { method: 'get' }).then((res) => res.text()).then((res) => {
const $ = cheerio.load(res, { xmlMode: false })
const title = $('meta[property="og:title"]').attr('content')
const duration = (() => { const s = parseInt($('meta[property="og:duration"]').attr('content'), 10) || 0; return s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s` : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s` })()
const image = $('meta[property="og:image"]').attr('content')
const videoType = $('meta[property="og:video:type"]').attr('content')
const videoWidth = $('meta[property="og:video:width"]').attr('content')
const videoHeight = $('meta[property="og:video:height"]').attr('content')
const info = $('span.metadata').text()
const videoScript = $('#video-player-bg > script:nth-child(6)').html()
const files = {
low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]
}
resolve({ status: 200, result: { title, URL, duration, image, videoType, videoWidth, videoHeight, info: parseInfo(info), files } })
}).catch((err) => reject({ code: 503, status: false, result: err }))
})
}
async function search(query) {
return new Promise((resolve, reject) => {
const baseurl = 'https://www.xnxx.com'
fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' })
.then((res) => res.text())
.then((res) => {
const $ = cheerio.load(res, { xmlMode: false })
const title = []
const url = []
const desc = []
const results = []
$('div.mozaique').each(function (a, b) {
$(b).find('div.thumb').each(function (c, d) {
url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'))
})
})
$('div.mozaique').each(function (a, b) {
$(b).find('div.thumb-under').each(function (c, d) {
desc.push($(d).find('p.metadata').text())
$(d).find('a').each(function (e, f) {
title.push($(f).attr('title'))
})})
})
for (let i = 0; i < title.length; i++) {
results.push({ title: title[i], info: desc[i], link: url[i] })
}
resolve({ code: 200, status: true, result: results })
})
.catch((err) => reject({ code: 503, status: false, result: err }))
})
}
