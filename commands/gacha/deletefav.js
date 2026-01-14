import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}
function flattenCharacters(structure) {
  return Object.values(structure).flatMap(s => Array.isArray(s.characters) ? s.characters : [])
}

export default {
  command: ['deletefav', 'delfav'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    if (chat.adminonly || !chat.gacha) {
      return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
    }
    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}
    const user = chat.users[m.sender]
    if (!user.favorite) {
      return m.reply('❀ No tienes ningún personaje marcado como favorito.')
    }
    const id = user.favorite
    let name = global.db.data.characters?.[id]?.name
    try {
      if (!name) {
        const structure = await loadCharacters()
        const all = flattenCharacters(structure)
        const original = all.find(c => c.id === id)
        name = original?.name || 'personaje desconocido'
      }
      delete user.favorite
      if (global.db.data.users?.[m.sender]?.favorite === id) {
        delete global.db.data.users[m.sender].favorite
      }
      m.reply(`✎ *${name}* ha dejado de ser tu personaje favorito.`)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}