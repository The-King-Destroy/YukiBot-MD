import ws from "ws"

const handler = async (m, { conn, command, usedPrefix, participants }) => {
try {
const users = [global.conn.user.jid, ...new Set(global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid))]
function convertirMsADiasHorasMinutosSegundos(ms) {
const segundos = Math.floor(ms / 1000)
const minutos = Math.floor(segundos / 60)
const horas = Math.floor(minutos / 60)
const días = Math.floor(horas / 24)
const segRest = segundos % 60
const minRest = minutos % 60
const horasRest = horas % 24
let resultado = ""
if (días) resultado += `${días} días, `
if (horasRest) resultado += `${horasRest} horas, `
if (minRest) resultado += `${minRest} minutos, `
if (segRest) resultado += `${segRest} segundos`
return resultado.trim()
}
let groupBots = users.filter((bot) => participants.some((p) => p.id === bot))
if (participants.some((p) => p.id === global.conn.user.jid) && !groupBots.includes(global.conn.user.jid)) { groupBots.push(global.conn.user.jid) }
const botsGroup = groupBots.length > 0 ? groupBots.map((bot) => {
const isMainBot = bot === global.conn.user.jid
const v = global.conns.find((conn) => conn.user.jid === bot)
const uptime = isMainBot ? convertirMsADiasHorasMinutosSegundos(Date.now() - global.conn.uptime) : v?.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "Activo desde ahora"
const mention = bot.replace(/[^0-9]/g, '')
return `@${mention}\n> Bot: ${isMainBot ? 'Principal' : 'Sub-Bot'}\n> Online: ${uptime}`}).join("\n\n") : `✧ No hay bots activos en este grupo`
const message = `*「 ✦ 」 Lista de bots activos*

❀ Principal: *1*
✿ Subs: *${users.length - 1}*

❏ En este grupo: *${groupBots.length}* bots
${botsGroup}`
const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)
rcanal.contextInfo.mentionedJid = mentionList
await conn.sendMessage(m.chat, { text: message, ...rcanal }, { quoted: m })
} catch (error) {
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`)
}}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler