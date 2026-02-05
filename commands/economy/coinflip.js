export default {
  command: ['cf', 'flip', 'coinflip'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings.currency
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    let cantidad, eleccion
    const a0 = parseFloat(args[0])
    const a1 = parseFloat(args[1])
    if (!isNaN(a0)) {
      cantidad = a0
      eleccion = (args[1] || '').toLowerCase()
    } else if (!isNaN(a1)) {
      cantidad = a1
      eleccion = (args[0] || '').toLowerCase()
    } else {
      return m.reply(`ꕥ Cantidad inválida, ingresa un número válido.\n> Ejemplo » *${usedPrefix + command} 200 cara* o *${usedPrefix + command} cruz 200*`)
    }
    if (Math.abs(cantidad) < 100) {
      return m.reply(`ꕥ La cantidad mínima para apostar es *100 ${monedas}*.`)
    }
    if (!['cara', 'cruz'].includes(eleccion)) {
      return m.reply(`ꕥ Elección inválida. Solo se admite *cara* o *cruz*.\n> Ejemplo » *${usedPrefix + command} 200 cara*`)
    }
    if (cantidad > user.coins) {
      return m.reply(`ꕥ No tienes suficientes *${monedas}* fuera del banco para apostar, tienes *¥${user.coins.toLocaleString()} ${monedas}*.`)
    }
    const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    const acierto = resultado === eleccion
    const cambio = acierto ? cantidad : -cantidad
    user.coins += cambio
    if (user.coins < 0) user.coins = 0
    const mensaje = `「✿」La moneda ha caído en *${capitalize(resultado)}* y has ${acierto ? 'ganado' : 'perdido'} *¥${Math.abs(cambio).toLocaleString()} ${monedas}*!\n> Tu elección fue *${capitalize(eleccion)}*`
    await client.sendMessage(m.chat, { text: mensaje }, { quoted: m })
  },
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}