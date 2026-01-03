var handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
let user = global.db.data.users[m.sender]
let now = Date.now()
let gap = 86400000
let maxStreak = 200
user.streak = user.streak || 0
user.lastDailyGlobal = user.lastDailyGlobal || 0
user.coin = user.coin || 0
user.exp = user.exp || 0
user.lastDaily = user.lastDaily || 0
if (now < user.lastDaily) {
let wait = formatTime(Math.floor((user.lastDaily - now) / 1000))
return conn.reply(m.chat, `ꕥ Ya has reclamado tu *Daily* de hoy.\n> Puedes reclamarlo de nuevo en *${wait}*`, m)
}
let lost = user.streak >= 1 && now - user.lastDailyGlobal > gap * 1.5
if (lost) user.streak = 0
let canClaimGlobal = now - user.lastDailyGlobal >= gap
if (canClaimGlobal) {
user.streak = Math.min(user.streak + 1, maxStreak)
user.lastDailyGlobal = now
}
let reward = Math.min(20000 + (user.streak - 1) * 5000, 1015000)
let expRandom = Math.floor(Math.random() * (100 - 20 + 1)) + 20
user.coin += reward
user.exp += expRandom
user.lastDaily = now + gap
let nextReward = Math.min(20000 + user.streak * 5000, 1015000).toLocaleString()
let msg = `> Día *${user.streak + 1}* » *+¥${nextReward}*`
if (lost) msg += `\n> ☆ ¡Has perdido tu racha de días!`
conn.reply(m.chat, `「✿」Has reclamado tu recompensa diaria de *¥${reward.toLocaleString()} ${currency}*! (Día *${user.streak}*)\n${msg}`, m)
}

handler.help = ['daily']
handler.tags = ['rpg']
handler.command = ['daily', 'diario']
handler.group = true

export default handler

function formatTime(t) {
const h = Math.floor(t / 3600)
const m = Math.floor((t % 3600) / 60)
const s = t % 60
const parts = []
if (h) parts.push(`${h} hora${h !== 1 ? 's' : ''}`)
if (m || h) parts.push(`${m} minuto${m !== 1 ? 's' : ''}`)
parts.push(`${s} segundo${s !== 1 ? 's' : ''}`)
return parts.join(' ')
}