export default {
  command: ['weekly', 'semanal'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chat = db.chats[m.chat]
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const user = db.chats[m.chat].users[m.sender]
    const users = db.users[m.sender]
    const gap = 604800000
    const now = Date.now()
    users.weeklyStreak = users.weeklyStreak || 0
    users.lastWeeklyGlobal = users.lastWeeklyGlobal || 0
    user.coins = user.coins || 0
    user.lastweekly = user.lastweekly || 0
    if (now < user.lastweekly) {
      const wait = formatTime(Math.floor((user.lastweekly - now) / 1000))
      return client.reply(m.chat, `ꕥ Ya has reclamado tu recompensa semanal.\n> Puedes reclamarlo de nuevo en *${wait}*`, m)
    }
    const lost = users.weeklyStreak >= 1 && now - users.lastWeeklyGlobal > gap * 1.5
    if (lost) users.weeklyStreak = 0
    const canClaimWeeklyGlobal = now - users.lastWeeklyGlobal >= gap
    if (canClaimWeeklyGlobal) {
      users.weeklyStreak = Math.min(users.weeklyStreak + 1, 30)
      users.lastWeeklyGlobal = now
    }
    const coins = Math.min(40000 + (users.weeklyStreak - 1) * 5000, 185000)
    user.coins += coins
    user.lastweekly = now + gap
    let nextReward = Math.min(40000 + users.weeklyStreak * 5000, 185000).toLocaleString()
    let msg = `> Semana *${users.weeklyStreak + 1}* » *+¥${nextReward}*`
    if (lost) msg += `\n> ☆ ¡Has perdido tu racha de semanas!`
    client.reply(m.chat, `「❁」 Has reclamado tu recompensa semanal de *¥${coins.toLocaleString()} ${currency}* (Semana *${users.weeklyStreak}*)\n${msg}`, m)
  }
}

function formatTime(t) {
  const d = Math.floor(t / 86400)
  const h = Math.floor((t % 86400) / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  if (d) return `${d} día${d !== 1 ? 's' : ''} ${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''}`
  if (h) return `${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  if (m) return `${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  return `${s} segundo${s !== 1 ? 's' : ''}`
}