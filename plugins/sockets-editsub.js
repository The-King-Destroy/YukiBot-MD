import fetch from 'node-fetch'
import Jimp from 'jimp'

const handler = async (m, { conn, command, usedPrefix, text }) => {
const isSubBots = [conn.user.jid, ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)].includes(m.sender)
if (!isSubBots) return m.reply(`❀ El comando *${command}* solo puede ser ejecutado por el Socket.`)
try {
const value = text ? text.trim() : ''
switch (command) {
case 'setpfp': case 'setimage': {
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/image\/(png|jpe?g)/.test(mime)) return conn.reply(m.chat, `❀ Por favor, responde o envía una imagen válida para cambiar la foto de perfil.`, m)
const media = await q.download()
if (!media) return conn.reply(m.chat, `ꕥ No se pudo obtener la imagen.`, m)
const image = await Jimp.read(media)
const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
await conn.updateProfilePicture(conn.user.jid, buffer)
conn.reply(m.chat, `❀ Se cambió la *foto de perfil* del Socket correctamente.`, m)
break
}
case 'setstatus': case 'setbio': {
if (!text) return conn.reply(m.chat, `❀ Por favor, ingresa la nueva biografía que deseas ponerme.`, m)
await conn.updateProfileStatus(text)
conn.reply(m.chat, `❀ Se cambió la biografía del Socket a *"${text}"* correctamente.`, m)
break
}
case 'setusername': case 'setuser': {
if (!value) return conn.reply(m.chat, '❀ Ingresa el nuevo nombre de usuario que deseas establecer.', m)
if (value.length < 3 || value.length > 25)
return conn.reply(m.chat, 'ꕥ El nombre debe tener entre 3 y 25 caracteres.')
await conn.updateProfileName(value)
m.reply(`❀ Se cambió el nombre de usuario a *${value}* correctamente.`)
break
}}} catch (error) {
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`)
}}

handler.help = ['setpfp', 'setimage', 'setstatus', 'setbio', 'setusername', 'setuser']
handler.tags = ['socket']
handler.command = ['setpfp', 'setimage', 'setstatus', 'setbio', 'setusername', 'setuser']

export default handler
