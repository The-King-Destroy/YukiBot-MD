async function handler(m, { conn, args, usedPrefix, command }) {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let mentionedJid = await m.mentionedJid
const who = m.quoted ? await m.quoted.sender : (mentionedJid && mentionedJid[0]) || (args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '')   
if (!args[0]) return m.reply(`❀ Debes mencionar a quien quieras regalar *${currency}*.\n> Ejemplo » *${usedPrefix + command} 25000 @mencion*`)
if (!isNumber(args[0]) && args[0].startsWith('@')) return m.reply(`ꕥ Primero indica la cantidad que deseas transferir, seguido de la persona a quien se lo envías.\nEjemplo: *${usedPrefix + command} 1000 @mencion*`)
if (!who) return m.reply(`ꕥ Debes mencionar a alguien para transferir *${currency}*.`)
if (!(who in global.db.data.users)) return m.reply(`ꕥ El usuario no está en la base de datos.`)
let user = global.db.data.users[m.sender]
let recipient = global.db.data.users[who]
let count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(10, (isNumber(args[0]) ? parseInt(args[0]) : 10)))
if (typeof user.bank !== 'number') user.bank = 0
if (user.bank < count) return m.reply(`ꕥ No tienes suficientes *${currency}* en el banco para transferir.`)
user.bank -= count
if (typeof recipient.bank !== 'number') recipient.bank = 0
recipient.bank += count   
if (isNaN(user.bank)) user.bank = 0
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
m.reply(`❀ Transferiste *¥${count.toLocaleString()} ${currency}* a *${name}*\n> Ahora tienes *¥${user.bank.toLocaleString()} ${currency}* en total en el banco.`, null, { mentions: [who] })
}

handler.help = ['pay']
handler.tags = ['rpg']
handler.command = ['pay', 'coinsgive', 'givecoins']
handler.group = true

export default handler

function isNumber(x) {
return !isNaN(x)
}