import fetch from 'node-fetch'
import { format } from 'util'

let handler = async (m, { conn, usedPrefix, text }) => {
if (m.fromMe) return
if (!/^https?:\/\//.test(text)) return m.reply(`❀ Por favor, ingresa la *url* de la pagina.`)
let url = text
await m.react('🕒')
let res = await fetch(url)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
throw `Content-Length: ${res.headers.get('content-length')}`
}
if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, 'file', text, m)
let txt = await res.buffer()
try {
txt = format(JSON.parse(txt + ''))
} catch (e) {
txt = txt + ''
} finally {
m.reply(txt.slice(0, 65536) + '')
await m.react('✔️')
}}

handler.help = ['get']
handler.tags = ['tools']
handler.command = ['fetch', 'get']

export default handler
