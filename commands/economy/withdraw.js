export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chatId = m.chat
    const senderId = m.sender
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]
    if (chatData.adminonly || !chatData.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const user = chatData.users[m.sender]
    const currency = botSettings.currency || 'Monedas'
    if (!args[0]) return m.reply(`《✧》 Ingresa la cantidad de *${currency}* que quieras retirar.`)
    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0)
        return m.reply(`No tienes suficientes *${currency}* en tu Banco para poder retirar.`)
      const amount = user.bank
      user.bank = 0
      user.coins = (user.coins || 0) + amount
      return m.reply(`✎ Has retirado *¥${amount.toLocaleString()} ${currency}* del banco, ahora podras usarlo pero tambien podran robartelo.`)
    }
    const count = parseInt(args[0])
    if (isNaN(count) || count < 1) return m.reply(`《✧》 Debes retirar una cantidad válida.\n > Ejemplo 1 » *${usedPrefix + command} ¥25000*\n> Ejemplo 2 » *${usedPrefix + command} all*`)
    if ((user.bank || 0) < count)
      return m.reply(`《✧》 No tienes suficientes *${currency}* en tu banco para retirar esa cantidad.\n> Solo tienes *¥${user.bank.toLocaleString()} ${currency}* en tu cuenta.`)
    user.bank -= count
    user.coins = (user.coins || 0) + count
    await m.reply(`✎ Has retirado *¥${count.toLocaleString()} ${currency}* del banco, ahora podras usarlo pero tambien podran robartelo.`)
  },
};