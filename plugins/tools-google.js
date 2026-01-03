import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, args }) => {
if (!text) return m.reply(`❀ Por favor, proporciona el término de búsqueda que deseas realizar a *Google*.\n\nEjemplo: ${usedPrefix}google gatos curiosos`)
const apiUrl = `${global.APIs.delirius.url}/search/googlesearch?query=${encodeURIComponent(text)}`
let maxResults = Number(args[1]) || 3
try {
await m.react('🕒')
const response = await fetch(apiUrl)
if (!response.ok) throw new Error('No se pudo conectar con la API')
const result = await response.json()
if (!result.status || !Array.isArray(result.data) || !result.data.length) {
await m.react('✖️')
return m.reply('ꕥ No se encontraron resultados para esa búsqueda.')
}
let replyMessage = `✦ Resultados de la búsqueda para: *${text}*\n\n`
result.data.slice(0, maxResults).forEach((item, index) => {
replyMessage += `❀ Título: *${index + 1}. ${item.title || 'Sin título'}*\n`
replyMessage += `✐︎ Descripción: ${item.description ? `*${item.description}*` : '_Sin descripción_'}\n`
replyMessage += `🜸 URL: ${item.url || '_Sin url_'}\n\n`})
await m.reply(replyMessage.trim())
await m.react('✔️')
} catch (error) {
await m.react('✖️')
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}.`)
}}

handler.help = ['google']
handler.command = ['google']
handler.group = true

export default handler