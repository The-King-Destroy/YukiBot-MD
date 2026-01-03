import fs from 'fs'
import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
import { unlinkSync, existsSync } from 'fs'

const exec = promisify(_exec).bind(cp)
const handler = async (m, { conn, text, command, usedPrefix, isROwner }) => {
if (!isROwner) return
try {
const ar = Object.keys(plugins)
const ar1 = ar.map(v => v.replace('.js', ''))
switch (command) {
case 'saveplugin': {
if (!text) return m.reply(`❀ Por favor, ingrese el nombre del plugin.`)
if (!m.quoted || !m.quoted.text) return m.reply(`✧ Responda al mensaje con el contenido del plugin.`)
await m.react('🕒')
const ruta = `plugins/${text}.js`
await fs.writeFileSync(ruta, m.quoted.text)
await m.react('✔️')
m.reply(`❀ Guardando plugin en ${ruta}`)
break
}
case 'savefile': {
if (!text) return m.reply(`❀ Ingresa la Ruta y el nombre del Archivo junto al comando.`)
if (!m.quoted?.text) return m.reply(`ꕥ Responde al mensaje.`)
await m.react('🕒')
const path = `${text}.js`
await fs.writeFileSync(path, m.quoted.text)
await m.react('✔️')
m.reply(`❀ Guardado en *${path}*.`)
break
}
case 'deletefile': {
if (!text) return conn.reply(m.chat, `❀ Ingresa la ruta y el nombre del archivo que deseas eliminar.`, m)
const file = text.trim()
if (!existsSync(file)) return conn.reply(m.chat, `ꕥ Archivo no encontrado.`, m)
await m.react('🕒')
unlinkSync(file)
await m.react('✔️')
conn.reply(m.chat, `❀ El archivo *${file}* ha sido eliminado con éxito.`, m)
break
}
case 'getplugin': {
if (!text) return conn.reply(m.chat,`❀ Ingrese el nombre de algún plugin existente*\n\n*—◉ Ejemplo*\n*◉ ${usedPrefix + command}* info-infobot\n\n*—◉ Lista de plugins:*\n*◉* ${ar1.map(v => ' ' + v).join`\n*◉*`}`, m)
if (!ar1.includes(text)) return conn.reply(m.chat, `ꕥ No se encontró el plugin "${text}".\n\n*—◉ Plugins existentes:*\n*◉* ${ar1.map(v => ' ' + v).join`\n*◉*`}`, m)
await m.react('🕒')
const filePath = `./plugins/${text}.js`
await conn.sendMessage(m.chat, { document: fs.readFileSync(filePath), mimetype: 'application/javascript', fileName: `${text}.js` }, { quoted: m })
await m.react('✔️')
break
}}} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa ${usedPrefix}report para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['saveplugin', 'savefile', 'deletefile', 'getplugin']
handler.tags = ['owner']
handler.command = ['saveplugin', 'savefile', 'deletefile', 'getplugin']

export default handler