const handler = async (m, { conn, isAdmin, groupMetadata, usedPrefix, isBotAdmin, isROwner }) => {
if (!isROwner) return
if (!isBotAdmin) return
if (isAdmin) return m.reply(`❀ Ya tienes privilegios de administrador.`)
try {
await m.react('🕒')
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
await m.react('✔️')
m.reply(`❀ Fuiste agregado como admin del grupo con exito.`)
} catch (error) {
await m.react('✖️')
m.reply(`⚠︎ Se ha producido un problema\n> Usa *${usedPrefix}report* para informarlo\n\n${error.message}`)
}}

handler.tags = ['owner']
handler.help = ['autoadmin']
handler.command = ['autoadmin']
handler.group = true

export default handler
