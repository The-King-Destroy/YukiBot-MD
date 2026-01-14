import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}
function flattenCharacters(structure) {
  return Object.values(structure).flatMap(s => Array.isArray(s.characters) ? s.characters : [])
}

function formatTime(ms) {
  if (ms <= 0) return 'Ahora'
  const totalSec = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (hours > 0) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`)
  if (minutes > 0 || hours > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

export default {
  command: ['gachainfo', 'ginfo', 'infogacha'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.characters) chat.characters = {}
      if (!chat.users) chat.users = {}
      if (!chat.users[m.sender]) chat.users[m.sender] = {}
      const me = chat.users[m.sender]
      const globalUser = global.db.data.users[m.sender]
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      const now = Date.now()
      const rollLeft = me.lastRoll && now < me.lastRoll ? me.lastRoll - now : 0
      const claimLeft = me.lastClaim && now < me.lastClaim ? me.lastClaim - now : 0
      const voteLeft = globalUser.lastVote && now < globalUser.lastVote ? globalUser.lastVote - now : 0
      const structure = await loadCharacters()
      const allCharacters = flattenCharacters(structure)
      const totalCharacters = allCharacters.length
      const totalSeries = Object.keys(structure).length
      const claimedIDs = Object.entries(chat.characters).filter(([, c]) => c.user === m.sender).map(([id]) => id)
      const totalValue = claimedIDs.reduce((sum, id) => {
        const globalVal = global.db.data.characters?.[id]?.value
        const jsonVal = allCharacters.find(c => c.id === id)?.value || 0
        const value = typeof globalVal === 'number' ? globalVal : jsonVal
        return sum + value
      }, 0)
      let userName = global.db.data.users[m.sender]?.name || m.sender.split('@')[0]
      const msg = `*❀ Usuario \`<${userName}>\`*\n\nⴵ RollWaifu » *${formatTime(rollLeft)}*\nⴵ Claim » *${formatTime(claimLeft)}*\nⴵ Vote » *${formatTime(voteLeft)}*\n\n♡ Personajes reclamados » *${claimedIDs.length}*\n✰ Valor total » *${totalValue.toLocaleString()}*\n❏ Personajes totales » *${totalCharacters}*\n❏ Series totales » *${totalSeries}*`
      await client.sendMessage(m.chat, { text: msg.trim() }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}
