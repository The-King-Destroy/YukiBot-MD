import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

export default {
  command: ['serielist', 'slist', 'animelist'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.users) chat.users = {}
      if (!chat.characters) chat.characters = {}
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      const structure = await loadCharacters()
      const seriesKeys = Object.keys(structure)
      const totalSeries = seriesKeys.length
      const page = parseInt(args[0]) || 1
      const perPage = 20
      const totalPages = Math.max(1, Math.ceil(totalSeries / perPage))
      if (page < 1 || page > totalPages) {
        return m.reply(`ꕥ Página no válida. Hay un total de *${totalPages}* páginas.`)
      }
      const start = (page - 1) * perPage
      const end = Math.min(start + perPage, totalSeries)
      const seriesPage = seriesKeys.slice(start, end)
      let msg = `*❏ Lista de series (${totalSeries}):*\n\n`
      for (const key of seriesPage) {
        const serie = structure[key]
        const name = typeof serie.name === 'string' ? serie.name : key
        const characters = Array.isArray(serie.characters) ? serie.characters.length : 0
        msg += `» *${name}* (${characters}) *ID* (${key})\n`
      }
      msg += `\n> • _Página ${page}/${totalPages}_`
      await m.reply(msg.trim())
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}