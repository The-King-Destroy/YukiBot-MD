const growth = Math.pow(Math.PI / Math.E, 1.618) * Math.E * 0.75
function xpRange(level, multiplier = global.multiplier || 2) {
  if (level < 0) throw new TypeError('level cannot be negative value')
  level = Math.floor(level)
  const min = level === 0 ? 0 : Math.round(Math.pow(level, growth) * multiplier) + 1
  const max = Math.round(Math.pow(level + 1, growth) * multiplier)
  return { min, max, xp: max - min }
}
function findLevel(xp, multiplier = global.multiplier || 2) {
  if (xp === Infinity) return Infinity
  if (isNaN(xp)) return NaN
  if (xp <= 0) return -1
  let level = 0
  do { level++ } while (xpRange(level, multiplier).min <= xp)
  return --level
}
function canLevelUp(level, xp, multiplier = global.multiplier || 2) {
  if (level < 0) return false
  if (xp === Infinity) return true
  if (isNaN(xp)) return false
  if (xp <= 0) return false
  return level < findLevel(xp, multiplier)
}

export default async (m) => {
  const user = global.db.data.users[m.sender]
  const users = global.db.data.chats[m.chat].users[m.sender]
  let before = user.level
  while (canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++  }
  if (before !== user.level) {
    const coinBonus = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000
    const expBonus = Math.floor(Math.random() * (500 - 100 + 1)) + 100
    if (user.level % 5 === 0) {
      users.coins = (users.coins || 0) + coinBonus
      user.exp = (user.exp || 0) + expBonus
    }
    const { min, max } = xpRange(user.level, global.multiplier)
    user.minxp = min
    user.maxxp = max
  }
}