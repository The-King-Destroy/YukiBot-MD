import { resolveLidToRealJid } from "../../lib/utils.js"

export async function before(m, { client }) {
const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net'
const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && botJid !== primaryBot) return 
const currency = global.db.data.settings[botJid]?.currency || 'coins'
const user = global.db.data.chats[m.chat].users[m.sender] ||= {}
user.coins = user.coins || 0
const formatTiempo = (ms) => {
if (typeof ms !== 'number' || isNaN(ms)) return 'desconocido'
const h = Math.floor(ms / 3600000)
const min = Math.floor((ms % 3600000) / 60000)
const s = Math.floor((ms % 60000) / 1000)
const parts = []
if (h) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
if (min) parts.push(`${min} ${min === 1 ? 'minuto' : 'minutos'}`)
if (s || (!h && !min)) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
return parts.join(' ')
}
if (typeof user.afk === 'number' && user.afk > -1) {
const ms = Date.now() - user.afk
const minutos = Math.floor(ms / 60000)
const horas = Math.floor(ms / 3600000)
let coins = minutos * 8
const bonos = Math.floor(horas / 3)
for (let i = 0; i < bonos; i++) {
coins += Math.floor(Math.random() * (1500 - 300 + 1)) + 300
}
user.coins += coins
const tiempo = formatTiempo(ms)
const recompensa = coins > 0 ? `\n> ○ Recompensa » *${coins} ${currency}*` : ''
await client.reply(m.chat, `ꕥ *${global.db.data.users[m.sender].name || 'Usuario'}* Dejaste de estar inactivo.\n> ○ Motivo » *${user.afkReason || 'sin especificar'}*\n> ○ Tiempo inactivo » *${tiempo}* ${recompensa}`, m)
user.afk = -1
user.afkReason = ''
}
const mentioned = m.mentionedJid || []
const quoted = m.quoted ? m.quoted.sender : null
let jids = []
if (mentioned.length) {
for (const id of mentioned) {
const real = await resolveLidToRealJid(id, client, m.chat)
if (real) jids.push(real)
}}
if (quoted) {
const real = await resolveLidToRealJid(quoted, client, m.chat)
if (real) jids.push(real)
}
jids = [...new Set(jids.filter(j => j && j.endsWith('@s.whatsapp.net') && j !== 'status@broadcast'))]
for (const jid of jids) {
const target = global.db.data.chats[m.chat].users[jid]
if (!target || typeof target.afk !== 'number' || target.afk < 0) continue
const ms = Date.now() - target.afk
const tiempo = formatTiempo(ms)
await client.reply(m.chat,`ꕥ El usuario *${global.db.data.users[jid].name || 'Usuario'}* está AFK.\n> ○ Motivo » *${target.afkReason || 'sin especificar'}*\n> ○ Tiempo inactivo » *${tiempo}*`, m)
}}
