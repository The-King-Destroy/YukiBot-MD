import chalk from 'chalk'

const limpiarRolls = () => {
  try {
    const chats = global.db.data.chats
    const now = Date.now()
    for (const chatId of Object.keys(chats)) {
      const chat = chats[chatId]
      if (!chat.rolls || typeof chat.rolls !== 'object') {
        chat.rolls = {}
        continue
      }
      for (const msgId of Object.keys(chat.rolls)) {
        const roll = chat.rolls[msgId]
        const expirado = roll.expiresAt && now > roll.expiresAt
        const reclamado = roll.claimed === true
        if (expirado || reclamado) {
          delete chat.rolls[msgId]
        }
      }
    }
  } catch (e) {
    console.log(chalk.gray('Error limpiando rolls'))
  }
}

setInterval(limpiarRolls, 1800000)
limpiarRolls()