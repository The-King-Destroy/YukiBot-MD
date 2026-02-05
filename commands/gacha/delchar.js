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
  command: ['delchar', 'deletewaifu', 'delwaifu'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.users) chat.users = {}
      if (!chat.characters) chat.characters = {}
      if (!chat.sales) chat.sales = {}
      if (!chat.users[m.sender]) chat.users[m.sender] = {}
      const me = chat.users[m.sender]
      if (!Array.isArray(me.characters)) me.characters = []
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      if (!me.characters.length) {
        return m.reply(`❀ No tienes personajes reclamados en tu harem.`)
      }
      if (!args.length) {
        return m.reply(`❀ Debes especificar un personaje para eliminar.\n> Ejemplo » *${usedPrefix + command} Yuki Suou*`)
      }
      const inputName = args.join(' ').toLowerCase().trim()
      const structure = await loadCharacters()
      const allCharacters = flattenCharacters(structure)
      const character = allCharacters.find(c => c.name.toLowerCase() === inputName)
      if (!character) {
        return m.reply(`ꕥ No se ha encontrado ningún personaje con el nombre *${inputName}*\n> Puedes sugerirlo usando *${usedPrefix}suggest personaje ${inputName}*`)
      }
      const record = chat.characters[character.id]
      if (!record || record.user !== m.sender || !me.characters.includes(character.id)) {
        return m.reply(`ꕥ *${character.name}* no está reclamado por ti.`)
      }
      delete chat.characters[character.id]
      me.characters = me.characters.filter(id => id !== character.id)
      if (chat.sales?.[character.id] && chat.sales[character.id].user === m.sender) {
        delete chat.sales[character.id]
      }
      if (chat.users[m.sender].favorite === character.id) {
        delete chat.users[m.sender].favorite
      }
      if (global.db.data.users?.[m.sender]?.favorite === character.id) {
        delete global.db.data.users[m.sender].favorite
      }
      await client.sendMessage(m.chat, { text: `❀ *${character.name}* ha sido eliminado de tu lista de reclamados.` }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}