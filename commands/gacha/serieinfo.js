import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

export default {
  command: ['serieinfo', 'ainfo', 'animeinfo'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.users) chat.users = {}
      if (!chat.characters) chat.characters = {}
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      if (!args.length) {
        return m.reply(`❀ Debes especificar el nombre de un anime\n> Ejemplo » ${usedPrefix + command} Naruto`)
      }
      const structure = await loadCharacters()
      const query = args.join(' ').toLowerCase().trim()
      const entries = Object.entries(structure)
      const match = entries.find(([, s]) => (typeof s.name === 'string' && s.name.toLowerCase().includes(query)) || (Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(query)))) || (entries.filter(([, s]) => (typeof s.name === 'string' && query.split(' ').some(w => s.name.toLowerCase().includes(w))) || (Array.isArray(s.tags) && s.tags.some(t => query.split(' ').some(w => t.toLowerCase().includes(w)))))[0] || [])
      const [seriesKey, seriesData] = match
      if (!seriesKey || !seriesData) {
        return m.reply(`ꕥ No se encontró la serie *${query}*\n> Puedes sugerirlo usando el comando *${usedPrefix}suggest sugerencia de serie: ${query}*`)
      }
      let list = Array.isArray(seriesData.characters) ? seriesData.characters : []
      const total = list.length
      const claimedList = list.filter(c => Object.values(chat.users).some(u => Array.isArray(u.characters) && u.characters.includes(c.id)))
      list.sort((a, b) => {
        const localA = chat.characters[a.id] || {}
        const localB = chat.characters[b.id] || {}
        const globalA = global.db.data.characters?.[a.id] || {}
        const globalB = global.db.data.characters?.[b.id] || {}
        const valA = typeof globalA.value === 'number' ? globalA.value : typeof localA.value === 'number' ? localA.value : Number(a.value || 0)
        const valB = typeof globalB.value === 'number' ? globalB.value : typeof localB.value === 'number' ? localB.value : Number(b.value || 0)
        return valB - valA
      })
      let msg = `*❀ Fuente: \`<${seriesData.name || seriesKey}>\`*\n\n`
      msg += `❏ Personajes » *\`${total}\`*\n`
      msg += `♡ Reclamados » *\`${claimedList.length}/${total} (${((claimedList.length / total) * 100).toFixed(0)}%)\`*\n`
      msg += `❏ Lista de personajes:\n\n`
      for (const c of list) {
        if (!chat.characters[c.id]) chat.characters[c.id] = {}
        const record = chat.characters[c.id]
        const globalVal = global.db.data.characters?.[c.id]?.value
        record.value = typeof globalVal === 'number' ? globalVal : typeof record.value === 'number' ? record.value : Number(c.value || 0)
        const ownerEntry = Object.entries(chat.users).find(([, u]) => Array.isArray(u.characters) && u.characters.includes(c.id))
        let ownerName = ownerEntry?.[0] ? (global.db.data.users[ownerEntry[0]]?.name?.trim() || ownerEntry[0].split('@')[0]) : 'desconocido'
        const status = ownerEntry ? `Reclamado por *${ownerName}*` : 'Libre'
        msg += `» *${c.name}* (${record.value.toLocaleString()}) • ${status}.\n`
      }
      msg += `\n> ⌦ _Página *1* de *1*_`
      await client.reply(m.chat, msg.trim(), m)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}