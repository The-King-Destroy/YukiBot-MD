export default {
  command: ['ppt'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency
    const botname = botSettings.namebot
    const chatData = db.chats[chatId]
    if (chatData.adminonly || !chatData.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const user = chatData.users[m.sender]
    user.lastppt ||= 0
    const remainingTime = user.lastppt - Date.now()
    if (remainingTime > 0)
      return m.reply(`ꕥ Debes esperar *${msToTime(remainingTime)}* antes de jugar nuevamente.`)
    const options = ['piedra', 'papel', 'tijera']
    const userChoice = args[0]?.trim().toLowerCase()
    if (!options.includes(userChoice)) return m.reply(`《✧》 Usa el comando así:\n› *${usedPrefix}ppt piedra*, *papel* o *tijera*`)
    const botChoice = options[Math.floor(Math.random() * options.length)]
    const result = determineWinner(userChoice, botChoice)
    const reward = Math.floor(Math.random() * (5500 - 3000 + 1)) + 3000
    const loss = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
    const tieReward = Math.floor(Math.random() * (1500 - 800 + 1)) + 800
    if (result === 'win') {
      user.coins += reward
      await client.sendMessage(chatId, { text: `ꕥ Ganaste.\n\n> ✿ *Tu elección ›* ${userChoice}\n> ✿ *${botname} eligió ›* ${botChoice}\n> ✿ *${monedas} ›* ¥${reward.toLocaleString()}` }, { quoted: m })
    } else if (result === 'lose') {
      const total = user.coins + user.bank
      const actualLoss = Math.min(loss, total)
      if (user.coins >= actualLoss) {
        user.coins -= actualLoss
      } else {
        const remaining = actualLoss - user.coins
        user.coins = 0
        user.bank = Math.max(0, user.bank - remaining)
      }
      await client.sendMessage(chatId, { text: `ꕥ Perdiste.\n\n> ✿ *Tu elección ›* ${userChoice}\n> ✿ *${botname} eligió ›* ${botChoice}\n> ✿ *${monedas} ›* -¥${actualLoss.toLocaleString()}` }, { quoted: m })
    } else {
      user.coins += tieReward
      await client.sendMessage(chatId, { text: `ꕥ Empate.\n\n> ✿ *Tu elección ›* ${userChoice}\n> ✿ *${botname} eligió ›* ${botChoice}\n> ✿ *${monedas} ›* +¥${tieReward.toLocaleString()}` }, { quoted: m })
    }
    user.lastppt = Date.now() + 1 * 60 * 1000
  },
};

function determineWinner(user, bot) {
  if (user === bot) return 'tie'
  if ((user === 'piedra' && bot === 'tijera') || (user === 'papel' && bot === 'piedra') || (user === 'tijera' && bot === 'papel'))
  return 'win'
  return 'lose'
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`
}