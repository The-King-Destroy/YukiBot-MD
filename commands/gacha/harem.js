import { promises as fs } from 'fs'
import { resolveLidToRealJid } from "../../lib/utils.js"

const charactersFilePath = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}
function flattenCharacters(structure) {
  return Object.values(structure).flatMap(s => Array.isArray(s.characters) ? s.characters : [])
}

export default {
  command: ['harem', 'waifus', 'claims'],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.users) chat.users = {}
      if (!chat.characters) chat.characters = {}
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      const mentionedJid = m.mentionedJid
      const who = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
      const userId = await resolveLidToRealJid(who, client, m.chat);
      const name = global.db.data.users[userId]?.name || userId.split('@')[0]
      const structure = await loadCharacters()
      const allCharacters = flattenCharacters(structure)
      const ownedIDs = Object.entries(chat.characters).filter(([, c]) => (c.user || '').replace(/[^0-9]/g, '') === userId.replace(/[^0-9]/g, '')).map(([id]) => id)
      if (ownedIDs.length === 0) {
        const msg = userId === m.sender ? 'ꕥ No tienes personajes reclamados.' : `ꕥ *${name}* no tiene personajes reclamados.`
        return client.sendMessage(m.chat, { text: msg, mentions: [userId] }, { quoted: m })
      }
      ownedIDs.sort((idA, idB) => {
        const localA = chat.characters[idA] || {}
        const localB = chat.characters[idB] || {}
        const globalA = global.db.data.characters?.[idA] || {}
        const globalB = global.db.data.characters?.[idB] || {}
        const valA = typeof globalA.value === 'number' ? globalA.value : typeof localA.value === 'number' ? localA.value : 0
        const valB = typeof globalB.value === 'number' ? globalB.value : typeof localB.value === 'number' ? localB.value : 0
        return valB - valA
      })
      const page = parseInt(args[1]) || 1
      const perPage = 50
      const totalPages = Math.ceil(ownedIDs.length / perPage)
      if (page < 1 || page > totalPages) {
        return m.reply(`❀ Página no válida. Hay un total de *${totalPages}* páginas.`)
      }
      const start = (page - 1) * perPage
      const end = Math.min(start + perPage, ownedIDs.length)
      let message = `✿ Personajes reclamados ✿\n`
      message += `⌦ Usuario: *${name}*\n`
      message += `♡ Personajes: *(${ownedIDs.length})*\n\n`
      for (let i = start; i < end; i++) {
        const id = ownedIDs[i]
        const local = chat.characters[id] || {}
        const globalRec = global?.db?.data?.characters?.[id] || {}
        const jsonRec = allCharacters.find(c => c.id === id)
        const charName = jsonRec?.name || local.name || globalRec.name || `ID:${id}`
        const value = typeof globalRec.value === 'number' ? globalRec.value : typeof local.value === 'number' ? local.value : Number(jsonRec?.value || 0)
        message += `» *${charName}* (*${value.toLocaleString()}*)\n`
      }
      message += `\n⌦ _Página *${page}* de *${totalPages}*_`
      await client.sendMessage(m.chat, { text: message.trim(), mentions: [userId] }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}