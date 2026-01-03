import fs from 'fs'

const handler = async (m, { conn, text, command, args, usedPrefix, isROwner }) => {
if (!isROwner) return
try {
const user = m.sender
let mentionedJid = await m.mentionedJid
let who = mentionedJid?.[0] || (await m.quoted?.sender) || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
switch (command) {
case 'backup': case 'copia': {
await m.react('🕒')
const date = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
const database = await fs.readFileSync('./database.json')
const creds = await fs.readFileSync('./Sessions/Principal/creds.json')
await conn.reply(m.chat, `*• Fecha:* ${date}`, m)
await conn.sendMessage(m.sender, { document: database, mimetype: 'application/json', fileName: `database.json` }, { quoted: m })
await conn.sendMessage(m.sender, { document: creds, mimetype: 'application/json', fileName: `creds.json` }, { quoted: m })
await m.react('✔️')
break
}
case 'resetuser': case 'resetear': {
if (!who) return conn.sendMessage(m.chat, { text: `❀ Formato de usuario no reconocido.` }, { quoted: m })
const userNumber = who.split('@')[0]
const userData = global.db.data.users?.[who]
if (!userData) return conn.sendMessage(m.chat, { text: `✧ El usuario @${userNumber} no se encuentra en mi base de datos.`, mentions: [who] }, { quoted: m })
if (userData.characters) {
for (let id in userData.characters) {
if (userData.characters[id].user === who) {
delete userData.characters[id]
}}}
if (userData.sales) {
for (let id in userData.sales) {
if (userData.sales[id].user === who) {
delete userData.sales[id]
}}}
for (let id in global.db.data.users) {
if (global.db.data.users[id]?.marry === who) {
delete global.db.data.users[id].marry
}}
delete global.db.data.users[who]
conn.sendMessage(m.chat, { text: `❀ Éxito. Todos los datos del usuario @${userNumber} fueron eliminados.`, mentions: [who] }, { quoted: m })
break
}
case 'jadibot': case 'serbot': {
const value = text ? text.trim().toLowerCase() : ''
const type = /jadibot|serbot/.test(command) ? 'jadibotmd' : null
if (!type) return m.reply(`ꕥ Modo no reconocido.`)
const isEnable = bot[type] || false
const enable = value === 'enable' || value === 'on'
const disable = value === 'disable' || value === 'off'
if (enable || disable) {
if (isEnable === enable) return m.reply(`ꕥ El modo *${type}* ya estaba ${enable ? 'activado' : 'desactivado'}.`)
bot[type] = enable
return conn.reply(m.chat, `❀ Has *${enable ? 'activado' : 'desactivado'}* el modo *${type}* para el Socket.`, m)
}
conn.reply(m.chat, `「✦」Puedes activar o desactivar el modo *${type}* utilizando:\n\n● Activar » ${usedPrefix}${command} enable\n● Desactivar » ${usedPrefix}${command} disable\n\nꕥ Estado actual » *${isEnable ? '✓ Activado' : '✗ Desactivado'}*`, m)
break
}}} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['backup', 'copia', 'resetuser', 'resetear']
handler.tags = ['owner']
handler.command = ['backup', 'copia', 'resetuser', 'resetear', 'jadibot', 'serbot']

export default handler
