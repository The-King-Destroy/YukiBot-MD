const handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
try {
if (!args[0]) return conn.reply(m.chat, `❀ Ingrese algún prefijo de un país para ejecutar el comando.`, m)
if (isNaN(args[0])) return conn.reply(m.chat, `ꕥ Ingrese algún prefijo de un país\nEjemplo: ${usedPrefix + command} 212`, m)
const lol = args[0].replace(/[+]/g, '')
const ps = participants.map(u => u.id).filter(v => v !== conn.user.jid && v.startsWith(lol))
const bot = global.db.data.settings[conn.user.jid] || {}
if (ps.length === 0) return m.reply(`ꕥ Aquí no hay ningún número con el prefijo +${lol}`)
const numeros = ps.map(v => '⭔ @' + v.replace(/@.+/, ''))
const delay = time => new Promise(res => setTimeout(res, time))
switch (command) {
case 'listanum': case 'listnum': {
conn.reply(m.chat, `❀ Lista de números con el prefijo +${lol} que están en este grupo:\n\n` + numeros.join`\n`, m, { mentions: ps })
break
}
case 'kicknum': {
const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'
const users = participants.map(u => u.id).filter(v => v !== conn.user.jid && v.startsWith(lol))
for (const user of users) {
const error = `ꕥ @${user.split('@')[0]} ya ha sido eliminado o ha abandonado el grupo.`
if (user !== ownerGroup && user !== conn.user.jid && user !== global.owner + '@s.whatsapp.net' && user.startsWith(lol) && isBotAdmin && bot.restrict) {
await delay(2000)
const responseb = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
if (responseb[0].status === '404') m.reply(error, m.chat, { mentions: conn.parseMention(error) })
await delay(10000)
} else {
return m.reply(`⚠︎ Ocurrió un error.`, m)
}}
break
}
}} catch (e) {
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`)
}}

handler.command = ['kicknum', 'listnum', 'listanum']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler