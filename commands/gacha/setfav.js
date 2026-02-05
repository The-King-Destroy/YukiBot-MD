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
  command: ['setfav', 'setfavourite'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    if (chat.adminonly || !chat.gacha) {
      return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
    }
    if (!args.length) {
      return m.reply(`❀ Debes especificar un personaje.\n> Ejemplo » *${usedPrefix + command} Yuki Suou*`)
    }
    if (!chat.users) chat.users = {}
    if (!chat.characters) chat.characters = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}
    const me = chat.users[m.sender]
    if (!Array.isArray(me.characters)) me.characters = []
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
    try {
      const structure = await loadCharacters()
      const allCharacters = flattenCharacters(structure)
      const name = args.join(' ').toLowerCase().trim()
     // const character = allCharacters.find(c => c.name.toLowerCase() === name)
      const character = allCharacters.find(c => String(c.name).toLowerCase() === name) || allCharacters.find(c => String(c.name).toLowerCase().includes(name) || (Array.isArray(c.tags) && c.tags.some(tag => tag.toLowerCase().includes(name)))) || allCharacters.find(c => name.split(' ').some(q => String(c.name).toLowerCase().includes(q) || (Array.isArray(c.tags) && c.tags.some(tag => tag.toLowerCase().includes(q)))))
      if (!character) return m.reply(`ꕥ No se encontró el personaje *${name}*.`)
      const isClaimed = me.characters.includes(character.id)
      if (!isClaimed) return m.reply(`ꕥ El personaje *${character.name}* no está reclamado por ti.`)
      const previousId = me.favorite
      me.favorite = character.id
      global.db.data.users[m.sender].favorite = character.id
      if (previousId && previousId !== character.id) {
        const prev = global.db.data.characters?.[previousId]
        const prevName = typeof prev?.name === 'string' ? prev.name : 'personaje anterior'
        return m.reply(`❀ Se ha reemplazado tu favorito *${prevName}* por *${character.name}*!`)
      }
      return m.reply(`❀ Ahora *${character.name}* es tu personaje favorito!`)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}
