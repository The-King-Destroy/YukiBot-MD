import { jidDecode } from '@whiskeysockets/baileys'
import path from 'path'
import fs from 'fs'
import ws from 'ws'

const linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
const handler = async (m, { conn, command, usedPrefix, text }) => {
try {
const isSubBots = [conn.user.jid, ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)].includes(m.sender)
if (!isSubBots) return m.reply(`❀ El comando *${command}* solo puede ser ejecutado por el Socket.`)
switch (command) {
case 'self': case 'public': {
const config = global.db.data.settings[conn.user.jid]
const value = text ? text.trim().toLowerCase() : ''
const type = /self|public/.test(command) ? 'self' : null
if (!type) return m.reply(`ꕥ Modo no reconocido.`)
const isEnable = config[type] || false
const enable = value === 'enable' || value === 'on'
const disable = value === 'disable' || value === 'off'
if (enable || disable) {
if (isEnable === enable)
return m.reply(`ꕥ El modo *${type}* ya estaba ${enable ? 'activado' : 'desactivado'}.`)
config[type] = enable
return conn.reply(m.chat, `❀ Has *${enable ? 'activado' : 'desactivado'}* el modo *${type}* para el Socket.`, m)
}
conn.reply(m.chat, `「✦」Puedes activar o desactivar el modo *${type}* utilizando:\n\n● Activar » ${usedPrefix}${command} enable\n● Desactivar » ${usedPrefix}${command} disable\n\n✧ Estado actual » *${isEnable ? '✓ Activado' : '✗ Desactivado'}*`, m)
break
}
case 'join': {
if (!text) return m.reply(`❀ Debes enviar un enlace de invitación para unirme a un grupo.`)
const [_, code] = text.match(linkRegex) || []
if (!code) return m.reply(`ꕥ El enlace de invitación no es válido.`)
await m.react('🕒')
await conn.groupAcceptInvite(code)
await m.react('✔️')
m.reply(`❀ ${botname} se a unido exitosamente al grupo.`)
break
}
case 'salir': case 'leave': {
await m.react('🕒')
const id = text || m.chat
const chat = global.db.data.chats[m.chat]
chat.welcome = false
await conn.reply(id, `❀ Adiós a todos, ${botname} se despide! (≧ω≦)ゞ`)
await conn.groupLeave(id)
chat.welcome = true
await m.react('✔️')
break
}
case 'logout': {
const rawId = conn.user?.id || ''
const cleanId = jidDecode(rawId)?.user || rawId.split('@')[0]
const index = global.conns?.findIndex(c => c.user.jid === m.sender)
if (global.conn.user.jid === conn.user.jid)
return conn.reply(m.chat, '❀ Este comando está deshabilitado en las sesiones principales.', m)
if (index === -1 || !global.conns[index])
return conn.reply(m.chat, '⚠︎ La sesión ya está cerrada o no se encontró una conexión activa.', m)
conn.reply(m.chat, '✩ Tu sesión ha sido cerrada exitosamente.', m)
setTimeout(async () => {
await global.conns[index].logout()
global.conns.splice(index, 1)
const sessionPath = path.join(global.jadi, cleanId)
if (fs.existsSync(sessionPath)) {
fs.rmSync(sessionPath, { recursive: true, force: true })
console.log(`⚠︎ Sesión de ${cleanId} eliminada de ${sessionPath}`)
}}, 3000)
break
}
case 'reload': {
const rawId = conn.user?.id || ''
const cleanId = jidDecode(rawId)?.user || rawId.split('@')[0]
const sessionPath = path.join(global.jadi, cleanId)
if (!fs.existsSync(sessionPath)) return conn.reply(m.chat, '❀ Este comando solo puede ejecutarse desde una instancia Sub-Bot.', m)
await m.react('🕒')
if (typeof global.reloadHandler !== 'function')
throw new Error('No se encontró la función global.reloadHandler')
await global.reloadHandler(true)
await m.react('✔️')
conn.reply(m.chat, '✿ La sesión fue recargada correctamente.', m)
break
}}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message || error}`, m)
}}

handler.command = ['self', 'public', 'join', 'salir', 'leave', 'logout', 'reload']
handler.help = ['self', 'public', 'join', 'salir', 'leave', 'logout', 'reload']
handler.tags = ['socket']

export default handler
