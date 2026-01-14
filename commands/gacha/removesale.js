export default {
  command: ['removesale', 'removerventa'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    if (!chat.sales) chat.sales = {}
    if (chat.adminonly || !chat.gacha) {
    return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}gacha on*`)
    }
    if (!args.length) {
      return m.reply(`❀ Debes especificar un personaje para eliminar.\n> Ejemplo » *${usedPrefix + command} Yuki Suou*`)
    }
    try {
      const nameRemove = args.join(' ').toLowerCase()
      const idRemove = Object.keys(chat.sales).find(id => (chat.sales[id]?.name || '').toLowerCase() === nameRemove)
      if (!idRemove || chat.sales[idRemove].user !== m.sender) {
        return m.reply(`ꕥ El personaje *${args.join(' ')}* no está a la venta por ti.`)
      }
      delete chat.sales[idRemove]
      m.reply(`❀ *${args.join(' ')}* ha sido eliminado de la lista de ventas.`)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}