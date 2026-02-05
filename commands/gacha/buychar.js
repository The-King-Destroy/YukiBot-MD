export default {
  command: ['buyc', 'buycharacter', 'buychar'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    if (!chat.sales) chat.sales = {}
    if (!chat.users) chat.users = {}
    if (!chat.characters) chat.characters = {}
    if (chat.adminonly || !chat.gacha) {
    return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}gacha on*`)
    }
    try {
      if (!args.length) {
        return m.reply(`❀ Debes especificar un personaje para comprar.\n> Ejemplo » *${usedPrefix + command} Yuki Suou*`)
      }
      const queryBuy = args.join(' ').toLowerCase()
      const idBuy = Object.keys(chat.sales).find(id => (chat.sales[id]?.name || '').toLowerCase() === queryBuy)
      if (!idBuy) return m.reply(`ꕥ No se ha encontrado al personaje *${args.join(' ')}* en venta.`)
      const venta = chat.sales[idBuy]
      if (venta.user === m.sender) return m.reply(`ꕥ No puedes comprar tu propio personaje.`)
      const compradorData = chat.users[m.sender]
      const saldo = typeof compradorData?.coins === 'number' ? compradorData.coins : 0
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const bot = global.db.data.settings[botId]
      const currency = bot.currency
      if (saldo < venta.price) {
        return m.reply(`ꕥ No tienes suficientes *${currency}* para comprar a *${venta.name}*.\n> Necesitas *¥${venta.price.toLocaleString()} ${currency}*`)
      }
      if (!chat.users[venta.user]) chat.users[venta.user] = { coins: 0, characters: [] }
      if (!Array.isArray(chat.users[venta.user].characters)) chat.users[venta.user].characters = []
      chat.users[m.sender].coins -= venta.price
      chat.users[venta.user].coins += venta.price
      chat.characters[idBuy].user = m.sender
      if (!chat.users[m.sender].characters.includes(idBuy)) {
        chat.users[m.sender].characters.push(idBuy)
      }
      chat.users[venta.user].characters = chat.users[venta.user].characters.filter(id => id !== idBuy)
      if (chat.users[venta.user].favorite === idBuy) delete chat.users[venta.user].favorite
      if (global.db.data.users?.[venta.user]?.favorite === idBuy) delete global.db.data.users[venta.user].favorite
      delete chat.sales[idBuy]
      let vendedorNombre = global.db.data.users[venta.user].name.trim() || venta.user.split('@')[0]
      let compradorNombre = global.db.data.users[m.sender].name.trim() || m.sender.split('@')[0]
      m.reply(`❀ *${venta.name}* ha sido comprado por *${compradorNombre}*!\n> Se han transferido *¥${venta.price.toLocaleString()} ${currency}* a *${vendedorNombre}*`)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}