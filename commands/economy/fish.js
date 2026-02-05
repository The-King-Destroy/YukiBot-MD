export default {
  command: ['pescar', 'fish'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    user.lastfish ||= 0
    const remainingTime = user.lastfish - Date.now()
    if (remainingTime > 0) {
      return m.reply(`ꕥ Debes esperar *${msToTime(remainingTime)}* antes de volver a pescar.`)
    }
    const rand = Math.random()
    let cantidad
    let message
    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000
      user.coins ||= 0
      user.coins += cantidad
      const successMessages = [
        `¡Has pescado un Salmón! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has pescado una Trucha! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has capturado un Tiburón! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has pescado una Ballena! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has capturado un Pez Payaso! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has atrapado una Anguila Dorada! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has pescado un Mero Gigante! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has capturado un Pulpo azul! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Sacaste una Carpa Real! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Has conseguido un Pez Dragón! Ganaste *¥${cantidad.toLocaleString()} ${currency}*!`
      ]
      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (6500 - 5000 + 1)) + 5000
      user.coins ||= 0
      user.bank ||= 0
      const total = user.coins + user.bank
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins -= cantidad
        } else {
          const restante = cantidad - user.coins
          user.coins = 0
          user.bank -= restante
        }
      } else {
        cantidad = total
        user.coins = 0
        user.bank = 0
      }
      const failMessages = [
        `El anzuelo se enredó y perdiste parte de tu equipo, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Una corriente fuerte arrastró tu caña, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Un pez grande rompió tu línea y dañó tu aparejo, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Tu bote se golpeó contra las rocas y tuviste que reparar, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `El pez escapó y arruinó tu red, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `El pez mordió el anzuelo pero se soltó y dañó tu carrete, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Tu cubeta se volcó y los peces atrapados se perdieron, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`
      ]
      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Pasaste la tarde pescando y observando cómo los peces nadaban cerca.`,
        `El agua estuvo tranquila y los peces se acercaban sin morder el anzuelo.`,
        `Tu jornada de pesca fue serena, los peces nadaban alrededor sin ser atrapados.`,
        `Los peces se mostraron esquivos, pero la experiencia de pesca fue agradable.`,
        `El río estuvo lleno de peces curiosos que se acercaban sin ser capturados.`
      ]
      message = pickRandom(neutralMessages)
    }
    user.lastfish = Date.now() + 8 * 60 * 1000
    await client.sendMessage(m.chat, { text: `「✿」 ${message}` }, { quoted: m })
  },
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const min = minutes < 10 ? '0' + minutes : minutes
  const sec = seconds < 10 ? '0' + seconds : seconds
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}