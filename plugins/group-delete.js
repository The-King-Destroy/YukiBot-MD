let handler = async (m, { conn, command }) => {
if (!m.quoted) {
return conn.reply(m.chat, `❀ Por favor, cita el mensaje que deseas eliminar.`, m)
}
try {
let participant = m.message.extendedTextMessage.contextInfo.participant
let stanzaId = m.message.extendedTextMessage.contextInfo.stanzaId
return conn.sendMessage(m.chat, {
delete: { remoteJid: m.chat, fromMe: false, id: stanzaId, participant: participant }})
} catch {
return conn.sendMessage(m.chat, { delete: m.quoted.key })
}}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del', 'delete']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler