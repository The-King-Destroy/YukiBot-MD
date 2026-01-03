import { canLevelUp, xpRange } from '../lib/levelling.js'
import db from '../lib/database.js'

let handler = async (m, { conn }) => {
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] || (m.quoted ? await m.quoted.sender : m.sender)
let user = global.db.data.users[who]
let name = await (async () => user.name?.trim() || (await conn.getName(who).then(n => typeof n === 'string' && n.trim() ? n : who.split('@')[0]).catch(() => who.split('@')[0])))()
if (!user) {
await conn.sendMessage(m.chat, { text: "ꕥ No se encontraron datos del usuario." }, { quoted: m })
return
}
let { min, xp } = xpRange(user.level, global.multiplier)
let before = user.level * 1
while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
if (before !== user.level) {
let txt = `ᥫ᭡ Felicidades Has subido de nivel.\n\n*${before}* ➔ *${user.level}*\n\n• ✰ *Nivel anterior* : ${before}\n• ✧ *Nuevos niveles* : ${user.level}\n• ❖ *Fecha* : ${new Date().toLocaleString('id-ID')}\n\n> ➨ Nota: *Cuanto más interactúes con el Bot, mayor será tu nivel.*`
await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
} else {
let users = Object.entries(global.db.data.users).map(([key, value]) => {
return { ...value, jid: key }
})
let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0))
let rank = sortedLevel.findIndex(u => u.jid === who) + 1
let txt = `*「✦」Usuario* ◢ ${name} ◤\n\n✧ Nivel » *${user.level}*\n✰ Experiencia » *${user.exp}*\n➨ Progreso » *${user.exp - min} => ${xp}* _(${Math.floor(((user.exp - min) / xp) * 100)}%)_\n# Puesto » *${rank}* de *${sortedLevel.length}*\n❒ Comandos totales » *${user.commands || 0}*`
await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}}

handler.help = ['levelup']
handler.tags = ['rpg']
handler.command = ['nivel', 'lvl', 'level', 'levelup']
handler.group = true

export default handler