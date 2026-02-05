import { delay } from "@whiskeysockets/baileys"

export default {
  command: ['slot'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chat = db.chats[m.chat]
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const user = db.chats[m.chat].users[m.sender]
    user.lastslot ||= 0
    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
      return m.reply(`❀ Por favor, ingresa la cantidad que deseas apostar.`)
    }
    const apuesta = parseInt(args[0])
    if (Date.now() - user.lastslot < 30000) {
      const restante = user.lastslot + 30000 - Date.now()
      return m.reply(`ꕥ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* nuevamente.`)
    }
    if (apuesta < 100) return m.reply(`ꕥ El mínimo para apostar es de 100 *${currency}*.`)
    if (user.coins < apuesta) return m.reply(`ꕥ Tus *${currency}* no son suficientes para apostar esa cantidad.`)
    const emojis = ['✾', '❃', '❁']
    const getRandomEmojis = () => {
      const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
      const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
      const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
      return { x, y, z }
    }
    const initialText = '「✿」| *SLOTS* \n────────\n'
    let { key } = await client.sendMessage(m.chat, { text: initialText }, { quoted: m })
    const animateSlots = async () => {
      for (let i = 0; i < 5; i++) {
        const { x, y, z } = getRandomEmojis()
        const animationText = `「✿」| *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────`
        await client.sendMessage(m.chat, { text: animationText, edit: key }, { quoted: m })
        await delay(300)
      }
    }
    await animateSlots()
    const { x, y, z } = getRandomEmojis()
    let resultado
    if (x[0] === y[0] && y[0] === z[0]) {
      resultado = `❀ Ganaste! *¥${(apuesta * 2).toLocaleString()} ${currency}*.`
      user.coins += apuesta
    } else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
      resultado = `❀ Casi lo logras. *Toma ¥10 ${currency}* por intentarlo.`
      user.coins += 10
    } else {
      resultado = `❀ Perdiste *¥${apuesta.toLocaleString()} ${currency}*.`
      user.coins -= apuesta
    }
    user.lastslot = Date.now()
    const finalText = `「✿」| *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────
${resultado}`
    await client.sendMessage(m.chat, { text: finalText, edit: key }, { quoted: m })
  }
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}