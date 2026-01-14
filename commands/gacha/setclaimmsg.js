export default {
  command: ['setclaim', 'setclaimmsg'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      if (!global.db.data.users) global.db.data.users = {}
      if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
      if (!args[0]) {
        return m.reply(`❀ Debes especificar un mensaje para reclamar un personaje.\n> Ejemplos:\n> ${usedPrefix + command} €user ha reclamado el personaje €character!\n> ${usedPrefix + command} €character ha sido reclamado por €user`)
      }
      const customMsg = args.join(' ')
      if (!customMsg.includes('€user') || !customMsg.includes('€character')) {
        return m.reply(`ꕥ Tu mensaje debe incluir *€user* y *€character* para que funcione correctamente.`)
      }
      global.db.data.users[m.sender].claimMessage = customMsg
      m.reply('❀ Mensaje de reclamación modificado.')
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}