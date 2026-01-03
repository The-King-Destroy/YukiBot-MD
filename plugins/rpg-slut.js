let handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
user.lastslut = user.lastslut || 0
const cooldown = 5 * 60 * 1000
if (Date.now() < user.lastslut) {
const restante = user.lastslut - Date.now()
const tiempoRestante = formatTime(restante)
return conn.reply(m.chat, `ꕥ Debes esperar *${tiempoRestante}* para usar *${usedPrefix + command}* de nuevo.`, m)
}
user.lastslut = Date.now() + cooldown
const evento = pickRandom(slut)
let cantidad
if (evento.tipo === 'victoria') {
cantidad = Math.floor(Math.random() * 1501) + 4000
user.coin += cantidad
} else {
cantidad = Math.floor(Math.random() * 1001) + 3000
user.coin -= cantidad
if (user.coin < 0) user.coin = 0
}
const mensaje = `❀ ${evento.mensaje} *¥${cantidad.toLocaleString()} ${currency}*`
await conn.reply(m.chat, mensaje, m)
}

handler.help = ['slut']
handler.tags = ['rpg']
handler.command = ['slut', 'protituirse']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
return parts.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const slut = [
{ tipo: 'victoria', mensaje: "Le acaricias el pene a un cliente habitual y ganaste." },
{ tipo: 'victoria', mensaje: "El admin se viene en tu boca, ganaste." },
{ tipo: 'victoria', mensaje: "El admin te manosea las tetas, ganaste." },
{ tipo: 'victoria', mensaje: "Te vistieron de neko kwai en publico, ganaste." },
{ tipo: 'victoria', mensaje: "Te haces la Loli del admin por un día, ganaste." },
{ tipo: 'victoria', mensaje: "Te dejas manosear por un extraño por dinero, ganaste." },
{ tipo: 'victoria', mensaje: "Eres la maid del admin por un día, ganaste." },
{ tipo: 'victoria', mensaje: "Un gay te paga para que lo hagas con el, ganaste." },
{ tipo: 'victoria', mensaje: "Tu SuggarMommy muere, ganaste." },
{ tipo: 'victoria', mensaje: "Tu SuggarDaddy muere, ganaste." },
{ tipo: 'victoria', mensaje: "Dejaste que un extraño te toque el culo por dinero, ganaste." },
{ tipo: 'victoria', mensaje: "Dejaste que un extraño te toque el culo por dinero, ganaste." },
{ tipo: 'victoria', mensaje: "Alguien te pone una correa y eres su mascota sexual por una hora, ganaste." },
{ tipo: 'victoria', mensaje: "Te vistieron de colegiala en público, ganaste." },
{ tipo: 'victoria', mensaje: "Te vistieron de una milf en público, ganaste." },
{ tipo: 'victoria', mensaje: "Los integrantes del grupo te usaron como saco de cum, ganaste." },
{ tipo: 'victoria', mensaje: "Eres la perra de los admins por un día, ganaste." },
{ tipo: 'victoria', mensaje: "Unos Aliens te secuestraron y te usaron cómo objeto sexual, ganaste." },
{ tipo: 'victoria', mensaje: "Un enano se culio tu pierna, ganaste." },
{ tipo: 'derrota', mensaje: "Intentaste cobrarle al cliente equivocado y te denunciaron, perdiste." },
{ tipo: 'derrota', mensaje: "El admin te bloqueó después del servicio, perdiste." },
{ tipo: 'derrota', mensaje: "Te disfrazaste sin que nadie te pagara, perdiste." },
{ tipo: 'derrota', mensaje: "La SuggarMommy te dejó por una waifu nueva, perdiste." },
{ tipo: 'derrota', mensaje: "Un extraño te robó el cosplay antes del evento, perdiste." },
{ tipo: 'derrota', mensaje: "Te manosearon sin pagar nada, perdiste." },
{ tipo: 'derrota', mensaje: "El gay se arrepintió en el último segundo, perdiste." },
{ tipo: 'derrota', mensaje: "Los Aliens te devolvieron con trauma, perdiste." }
]
