import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command }) => {
try {
let member = participants.map(u => u.id)
if (!text) {
var sum = member.length
} else {
var sum = text
}
var total = 0
var sider = []
for (let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
if ((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) {
if (typeof global.db.data.users[member[i]] !== 'undefined') {
if (global.db.data.users[member[i]].whitelist == false) {
total++
sider.push(member[i])
}} else {
total++
sider.push(member[i])
}}}
const delay = time => new Promise(res => setTimeout(res, time))
switch (command) {
case 'inactivos': case 'fantasmas': {
if (total == 0) return conn.reply(m.chat, `ꕥ Este grupo es activo, no tiene fantasmas.`, m)
m.reply(`❀ *Revisión de inactivos*\n\n✦ *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n> ✰ NOTA: Esto no es al 100% acertado, el bot inicia el conteo de mensajes a partir del momento que se activa en este grupo.`, null, { mentions: sider })
break
}
case 'kickinactivos': case 'kickfantasmas': {
if (total == 0) return conn.reply(m.chat, `ꕥ Este grupo es activo no tiene fantasmas.`, m)
await m.reply(`❀ *Eliminación de inactivos*\n\n✦ *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n> ✰ Nota: El bot eliminara a los usuarios de la lista mencionada cada 10 segundos.`, null, { mentions: sider })
await delay(1 * 10000)
let chat = global.db.data.chats[m.chat]
chat.welcome = false
try {
let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
let kickedGhost = sider.map(v => v.id).filter(v => v !== conn.user.jid)
for (let user of users)
if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
let res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
kickedGhost.concat(res)
await delay(1 * 10000)
}} finally {
chat.welcome = true
}
break
}}} catch (e) {
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`)
}}

handler.tags = ['grupo']
handler.command = ['inactivos', 'fantasmas', 'kickinactivos', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))