export default {
  command: ['cazar', 'hunt'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)    
    user.lasthunt ||= 0
    if (user.coins == null) user.coins = 0
    if (user.health == null) user.health = 100
    if (user.health < 5) 
      return m.reply(`ꕥ No tienes suficiente salud para volver a *cazar*.\n> Usa *"${usedPrefix}heal"* para curarte.`)
      if (Date.now() < user.lasthunt) {
      const restante = user.lasthunt - Date.now()
      return m.reply(`ꕥ Debes esperar *${msToTime(restante)}* antes de volver a cazar.`)
      }
    const rand = Math.random()
    let cantidad = 0
    let salud = Math.floor(Math.random() * (15 - 10 + 1)) + 10
    let message
    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (13000 - 10000 + 1)) + 10000
      user.coins ||= 0
      user.coins += cantidad
      user.health -= salud
      const successMessages = [
        `¡Con gran valentía, lograste cazar un Oso! Ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Has cazado un Tigre feroz! Tras una persecución electrizante, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Lograste cazar un Elefante con astucia y persistencia, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Has cazado un Panda! La caza fue tranquila, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Cazaste un Jabalí tras un rastreo emocionante, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Con gran destreza, atrapaste un Cocodrilo, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Has cazado un Ciervo robusto! Ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Con paciencia lograste cazar un Zorro plateado, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Localizaste un grupo de peces en el río y atrapaste varios, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Te internaste en la niebla del bosque y cazaste un jabalí salvaje, ganaste *¥${cantidad.toLocaleString()} ${currency}*.`
      ]
      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000
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
      user.health -= salud
      if (user.health < 0) user.health = 0
      const failMessages = [
        `Tu presa se escapó y no lograste cazar nada, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Tropezaste mientras apuntabas y la presa huyó, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Un rugido te distrajo y no lograste dar en el blanco, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Tu arco se rompió justo en el momento crucial, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Un aguacero repentino arruinó tu ruta de caza, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Un jabalí te embistió y tuviste que huir, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `Un tigre te sorprendió y escapaste con pérdidas, perdiste *¥${cantidad.toLocaleString()} ${currency}*.`
      ]
      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `Pasaste la tarde cazando y observando cómo los animales se movían en silencio.`,
        `El bosque estuvo tranquilo y los animales se mostraron esquivos.`,
        `Tu jornada de caza fue serena, los animales se acercaban sin ser atrapados.`,
        `Los animales se mostraron cautelosos, pero la experiencia de caza fue agradable.`,
        `Exploraste nuevas rutas de caza y descubriste huellas frescas.`
      ]
      message = pickRandom(neutralMessages)
    }
    user.lasthunt = Date.now() + 15 * 60 * 1000
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
