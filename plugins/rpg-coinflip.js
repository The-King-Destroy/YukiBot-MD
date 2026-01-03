const handler = async (m, { conn, text, command, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) return conn.reply(m.chat, `《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`, m)
const user = global.db.data.users[m.sender]
if (!text) return conn.reply(m.chat, `❀ Debes apostar una cantidad válida.\n> Ejemplo » *${usedPrefix + command} 150 (cara/cruz).*`, m)
const args = text.trim().split(/\s+/)
if (!args[0] || !args[1]) return conn.reply(m.chat, `❀ Formato incorrecto, debes poner la cantidad y luego cara/cruz.\n> Ejemplo » *${usedPrefix + command} 150 cruz*`, m)
const cantidad = parseFloat(args[0])
const eleccion = args[1].toLowerCase()
if (isNaN(cantidad)) return conn.reply(m.chat, `ꕥ Cantidad inválida, ingresa un número válido.\n> Ejemplo » *${usedPrefix + command} 200 cruz*`, m)
if (Math.abs(cantidad) < 100) return conn.reply(m.chat, `ꕥ La cantidad mínima para apostar es *100 ${currency}*.`, m)
if (!['cara', 'cruz'].includes(eleccion)) return conn.reply(m.chat, `ꕥ Elección inválida. Solo se admite *cara* o *cruz*.\n> Ejemplo » *${usedPrefix + command} 200 cara*`, m)
if (cantidad > user.coin) return conn.reply(m.chat, `ꕥ No tienes suficientes *${currency}* para apostar, tienes *¥${user.coin.toLocaleString()} ${currency}*.`, m)
const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
const acierto = resultado === eleccion
const cambio = acierto ? cantidad : -cantidad
user.coin += cambio
if (user.coin < 0) user.coin = 0
const mensaje = `「✿」La moneda ha caído en *${capitalize(resultado)}* y has ${acierto ? 'ganado' : 'perdido'} *¥${Math.abs(cambio).toLocaleString()} ${currency}*!\n> Tu elección fue *${capitalize(eleccion)}*`
return conn.reply(m.chat, mensaje, m)
}

handler.help = ['cf']
handler.tags = ['economy']
handler.command = ['cf', 'suerte', 'coinflip', 'flip']
handler.group = true

export default handler

function capitalize(txt) {
return txt.charAt(0).toUpperCase() + txt.slice(1)
}