const linkRegex = /(https?:\/\/)?(chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}|whatsapp\.com\/channel\/[0-9A-Za-z]{20,24})/i
const allowedLinks = ['https://whatsapp.com/channel/0029Vb64nWqLo4hb8cuxe23n']

export default async (client, m) => {
if (!m.isGroup || !m.text) return
const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
if (!groupMetadata) return
const participants = groupMetadata.participants || []
const groupAdmins = participants.filter(p => p.admin).map(p => p.phoneNumber || p.jid || p.id || p.lid)
const isAdmin = groupAdmins.includes(m.sender)
const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
const isBotAdmin = groupAdmins.includes(botId)
const chat = global?.db?.data?.chats?.[m.chat]
const primaryBotId = chat?.primaryBot
const isPrimary = !primaryBotId || primaryBotId === botId
const isGroupLink = linkRegex.test(m.text)
const hasAllowedLink = allowedLinks.some(link => m.text.includes(link))
const command = (m.noPrefix?.trim().split(/\s+/)[0] || '').toLowerCase()
if (hasAllowedLink || !isGroupLink || !chat?.antilinks || isAdmin || !isBotAdmin || !isPrimary) return
await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
if (!(command === 'invite')) {
const isChannelLink = /whatsapp\.com\/channel\//i.test(m.text)
const userName = global.db.data.users[m.sender]?.name || 'Usuario'
await client.reply(m.chat, `> ꕥ Se ha eliminado a *${userName}* del grupo por \`Anti-Link\`, no permitimos enlaces de *${isChannelLink ? 'canales' : 'otros grupos'}*.`, null)
await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}}
