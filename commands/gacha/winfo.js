import fetch from 'node-fetch'
import { promises as fs } from 'fs'

const FILE_PATH = './lib/characters.json'
async function loadCharacters() {
  try {
    await fs.access(FILE_PATH)
  } catch {
    await fs.writeFile(FILE_PATH, '{}')
  }
  const raw = await fs.readFile(FILE_PATH, 'utf-8')
  return JSON.parse(raw)
}
function flattenCharacters(db) {
  return Object.values(db).flatMap(s => Array.isArray(s.characters) ? s.characters : [])
}

function getSeriesNameByCharacter(db, id) {
  return Object.entries(db).find(([, serie]) => Array.isArray(serie.characters) && serie.characters.some(c => String(c.id) === String(id)))?.[1]?.name || 'Desconocido'
}
function formatElapsed(ms) {
  if (!ms || ms <= 0) return '—'
  const sec = Math.floor(ms / 1000)
  const w = Math.floor(sec / 604800)
  const d = Math.floor((sec % 604800) / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const parts = []
  if (w > 0) parts.push(`${w}w`)
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  if (s > 0) parts.push(`${s}s`)
  return parts.join(' ')
}

export default {
  command: ['charinfo', 'winfo', 'waifuinfo'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      const db = global.db.data
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      if (!args.length) {
        return m.reply(`❀ Por favor, proporciona el nombre de un personaje.\n> Ejemplo » *${usedPrefix + command} Yuki Suou*`)
      }
      const structure = await loadCharacters()
      const allCharacters = flattenCharacters(structure)
      const nameQuery = args.join(' ').toLowerCase().trim()
      const character = allCharacters.find(c => String(c.name).toLowerCase() === nameQuery) || allCharacters.find(c => String(c.name).toLowerCase().includes(nameQuery) || (Array.isArray(c.tags) && c.tags.some(tag => tag.toLowerCase().includes(nameQuery)))) || allCharacters.find(c => nameQuery.split(' ').some(q => String(c.name).toLowerCase().includes(q) || (Array.isArray(c.tags) && c.tags.some(tag => tag.toLowerCase().includes(q)))))
      if (!character) {
        return m.reply(`ꕥ No se encontró el personaje *${nameQuery}*.`)
      }
      if (!db.characters) db.characters = {}
      if (!chat.users) chat.users = {}
      if (!chat.characters) chat.characters = {}
      const source = getSeriesNameByCharacter(structure, character.id)
      if (!db.characters[character.id]) db.characters[character.id] = {}
      const record = db.characters[character.id]
      if (record.name == null) record.name = character.name
      if (typeof record.value !== 'number') record.value = Number(character.value) || 100
      if (typeof record.votes !== 'number') record.votes = 0
      const userEntry = Object.entries(chat.users).find(([, u]) => Array.isArray(u.characters) && u.characters.includes(character.id))
      let ownerName = userEntry?.[0] ? (global.db.data.users[userEntry[0]]?.name?.trim() || userEntry[0].split('@')[0]) : 'Desconocido'
      const localRec = chat.characters[character.id] || {}
      const claimedDateLine = (localRec.user && localRec.claimedAt) ? `\nⴵ Fecha de reclamo » *${new Date(localRec.claimedAt).toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}*` : ''
      const lastVoteAgo = typeof record.lastVotedAt === 'number' ? `hace *${formatElapsed(Date.now() - record.lastVotedAt)}*` : '*Nunca*'
      const sorted = Object.values(db.characters).filter(c => typeof c.value === 'number').sort((a, b) => b.value - a.value)
      const rank = sorted.findIndex(c => c.name === character.name) + 1 || '—'
      const msg = `❀ Nombre » *${record.name}*
⚥ Género » *${character.gender || 'Desconocido'}*
✰ Valor » *${record.value.toLocaleString()}*
♡ Estado » ${userEntry ? `Reclamado por *${ownerName}*` : '*Libre*'}${claimedDateLine}
❖ Fuente » *${source}*
❏ Puesto » *#${rank}*
ⴵ Último voto » ${lastVoteAgo}`.trim()
      await client.sendMessage(m.chat, { text: msg }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}