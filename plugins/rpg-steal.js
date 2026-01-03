const handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
const user = global.db.data.users[m.sender]
user.lastrob = user.lastrob || 0
if (Date.now() < user.lastrob) {
const restante = user.lastrob - Date.now()
return conn.reply(m.chat, `ꕥ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* de nuevo.`, m)
}
let mentionedJid = await m.mentionedJid
let who = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!who) return conn.reply(m.chat, `❀ Debes mencionar a alguien para intentar robarle.`, m)
if (!(who in global.db.data.users)) {
return conn.reply(m.chat, `ꕥ El usuario no se encuentra en mi base de datos.`, m)
}
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
const target = global.db.data.users[who]
const tiempoInactivo = Date.now() - (target.lastwork || 0)
if (tiempoInactivo < 3600000) {
return conn.reply(m.chat, `ꕥ Solo puedes robarle *${currency}* a un usuario si estuvo más de 1 hora inactivo.`, m)
}
const rob = Math.floor(Math.random() * 1001) + 2000
if (target.coin < rob) {
return conn.reply(m.chat, `ꕥ *${name}* no tiene suficientes *${currency}* fuera del banco como para que valga la pena intentar robar.`, m, { mentions: [who] })
}
user.coin += rob
target.coin -= rob
user.lastrob = Date.now() + 7200000
conn.reply(m.chat, `❀ Le robaste *¥${rob.toLocaleString()} ${currency}* a *${name}*`, m, { mentions: [who] })
}

handler.help = ['rob']
handler.tags = ['rpg']
handler.command = ['robar', 'steal', 'rob']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const hours = Math.floor(totalSec / 3600)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (hours) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`)
if (minutes) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
return parts.join(' ')
}