var handler = async (m, { conn, participants, usedPrefix, command }) => {
let mentionedJid = await m.mentionedJid
let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!user) return conn.reply(m.chat, `❀ Debes mencionar a un usuario para poder expulsarlo del grupo.`, m)
try {
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
if (user === conn.user.jid) return conn.reply(m.chat, `ꕥ No puedo eliminar el bot del grupo.`, m)
if (user === ownerGroup) return conn.reply(m.chat, `ꕥ No puedo eliminar al propietario del grupo.`, m)
if (user === ownerBot) return conn.reply(m.chat, `ꕥ No puedo eliminar al propietario del bot.`, m)
await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar','sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler