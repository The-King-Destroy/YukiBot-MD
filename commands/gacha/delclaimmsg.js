export default {
  command: ['delclaimmsg', 'resetclaimmsg'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      if (!global.db.data.users) global.db.data.users = {}
      if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
      delete global.db.data.users[m.sender].claimMessage
      m.reply('❀ Mensaje de reclamación restablecido.')
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}