import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, usedPrefix }) => {
if (!m.quoted && !text) return conn.reply(m.chat, `❀ Por favor, escribe el texto que deseas repetir.`, m)
let mentionedJid = await m.mentionedJid
let htextos = text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : "¡¡¡Hola!!!"
if ((mentionedJid && mentionedJid.length) || (m.quoted && m.quoted.mentionedJid && m.quoted.mentionedJid.length)) {
let copy = htextos
let list = mentionedJid || m.quoted.mentionedJid
for (let i = 0; i < list.length; i++) {
let num = list[i].split('@')[0]
copy = copy.replace(/@\S+/, '@' + num)
}
htextos = copy
}
let users = mentionedJid?.length ? mentionedJid : m.quoted?.mentionedJid?.length ? m.quoted.mentionedJid : []
let mentions = users.map(jid => conn.decodeJid(jid))
try {
let q = m.quoted ? m.quoted : m || m.text || m.sender
let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
let msg = generateWAMessageFromContent(m.chat, { extendedTextMessage: { text: htextos, contextInfo: { mentionedJid: mentions }}}, { quoted: null, userJid: conn.user.id })
await conn.relayMessage(m.chat, msg.message, { messageId: msg.key?.id || undefined })
} catch {
let quoted = m.quoted ? m.quoted : m
let mime = (quoted.msg || quoted).mimetype || ''
let isMedia = /image|video|sticker|audio/.test(mime)
if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { image: mediax, caption: htextos, mentions }, { quoted: null })
} else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', caption: htextos, mentions }, { quoted: null })
} else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mp4', fileName: `audio.mp4`, mentions }, { quoted: null })
} else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { sticker: mediax, mentions }, { quoted: null })
} else {
await conn.relayMessage(m.chat, { extendedTextMessage: { text: `${htextos}\n`, contextInfo: { mentionedJid: mentions }}})
}}}

handler.help = ['say']
handler.command = ['say', 'decir']
handler.tags = ['tools']
handler.group = true

export default handler