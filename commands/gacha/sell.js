export default {
  command: ['sell', 'vender'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    if (!chat.characters) chat.characters = {}
    if (!chat.sales) chat.sales = {}
    if (!chat.users) chat.users = {}
    if (chat.adminonly || !chat.gacha) {
    return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
    }
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = global.db.data.settings[botId]
    const currency = bot.currency
    try {
      if (args.length < 2) {
        return m.reply(`❀ Debes especificar un precio para subastar el personaje.\n> Ejemplo » *${usedPrefix + command} 5000 Yuki Suou*`)
      }
      const price = parseInt(args[0])
      if (isNaN(price) || price < 2000) return m.reply(`ꕥ El precio mínimo para subastar un personaje es de *¥2,000 ${currency}*.`)
      if (price > 100_000_000) return m.reply(`ꕥ El precio máximo permitido para subastar un personaje es de *¥100,000,000 ${currency}*.`)
      const name = args.slice(1).join(' ').toLowerCase()
      const idSell = Object.keys(chat.characters).find(id => (chat.characters[id]?.name || '').toLowerCase() === name)
      if (!idSell) return m.reply(`ꕥ No se ha encontrado al personaje *${args.slice(1).join(' ')}*.`)
      const charSell = chat.characters[idSell]
      if (charSell.user !== m.sender) return m.reply(`ꕥ *${charSell.name}* debe ser reclamado por ti para poder venderlo.`)
      chat.sales[idSell] = { name: charSell.name, user: m.sender, price, time: Date.now() }
      let sellerName = global.db.data.users[m.sender].name.trim() || m.sender.split('@')[0]
      m.reply(`✎ *${charSell.name}* ha sido puesto a la venta!\n❀ Vendedor » *${sellerName}*\n⛁ Valor » *¥${price.toLocaleString()} ${currency}*\nⴵ Expira en » *3 dias*\n> Puedes ver los personajes en venta usando *${usedPrefix}wshop*`)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}