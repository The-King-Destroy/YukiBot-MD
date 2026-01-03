import { delay } from "@whiskeysockets/baileys"

const handler = async (m, { args, usedPrefix, command, conn }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
const users = global.db.data.users[m.sender]
if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
return m.reply(`❀ Por favor, ingresa la cantidad que deseas apostar.`)
}
const apuesta = parseInt(args[0])
if (Date.now() - users.lastslot < 10000) {
const restante = users.lastslot + 10000 - Date.now()
return m.reply(`ꕥ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* nuevamente.`)
}
if (apuesta < 100) return m.reply(`ꕥ El mínimo para apostar es de 100 *${currency}*.`)
if (users.coin < apuesta) return m.reply(`ꕥ Tus *${currency}* no son suficientes para apostar esa cantidad.`)
const emojis = ['✾', '❃', '❁']
const getRandomEmojis = () => {
const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
return { x, y, z }
}
const initialText = '「✿」| *SLOTS* \n────────\n'
let { key } = await conn.sendMessage(m.chat, { text: initialText }, { quoted: m })
const animateSlots = async () => {
for (let i = 0; i < 5; i++) {
const { x, y, z } = getRandomEmojis()
const animationText = `「✿」| *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────`
await conn.sendMessage(m.chat, { text: animationText, edit: key }, { quoted: m })
await delay(300)
}}
await animateSlots()
const { x, y, z } = getRandomEmojis()
let resultado
if (x[0] === y[0] && y[0] === z[0]) {
resultado = `❀ Ganaste! *¥${(apuesta * 2).toLocaleString()} ${currency}*.`
users.coin += apuesta
} else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
resultado = `❀ Casi lo logras. *Toma ¥10 ${currency}* por intentarlo.`
users.coin += 10
} else {
resultado = `❀ Perdiste *¥${apuesta.toLocaleString()} ${currency}*.`
users.coin -= apuesta
}
users.lastslot = Date.now()
const finalText = `「✿」| *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────
${resultado}`
await conn.sendMessage(m.chat, { text: finalText, edit: key }, { quoted: m })
}

handler.help = ['slot <apuesta>']
handler.tags = ['rpg']
handler.command = ['slot']
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