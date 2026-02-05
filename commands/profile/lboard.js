const growth = Math.pow(Math.PI / Math.E, 1.618) * Math.E * 0.75
function xpRange(level, multiplier = global.multiplier || 2) {
  if (level < 0) throw new TypeError('level cannot be negative value')
  level = Math.floor(level)
  const min = level === 0 ? 0 : Math.round(Math.pow(level, growth) * multiplier) + 1
  const max = Math.round(Math.pow(level + 1, growth) * multiplier)
  return { min, max, xp: max - min }
}

export default {
  command: ['lboard', 'lb', 'leaderboard'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    try {
      const users = Object.entries(db.users || {}).filter(([_, data]) => (data.exp || 0) >= 1).map(([key, data]) => {
          const name = data.name || 'Usuario'
          const exp = data.exp || 0
          const level = data.level || 0
          const { min, xp } = xpRange(level, global.multiplier)
          const progreso = exp - min
          const porcentaje = xp > 0 ? Math.floor((progreso / xp) * 100) : 0
          return { jid: key, name, exp, level, progreso, xp, porcentaje }
        })
      if (users.length === 0)
        return m.reply(`ꕥ No hay usuarios registrados con experiencia.`)
      const sorted = users.sort((a, b) => (b.exp || 0) - (a.exp || 0))
      const page = parseInt(args[0]) || 1
      const pageSize = 10
      const totalPages = Math.ceil(sorted.length / pageSize)
      if (isNaN(page) || page < 1 || page > totalPages) return m.reply(`《✧》 La página *${page}* no existe. Hay *${totalPages}* páginas.`)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      let text = `*✩ Top de usuarios con más experiencia ✩*\n\n`
      text += sorted.slice(start, end).map(({ name, exp, level, progreso, xp, porcentaje }, i) => {
          return `✩ ${start + i + 1} › *${name}*\n     XP → *${exp.toLocaleString()}*  LVL → *${level}*\n     ➨ Progreso → *${progreso} => ${xp}* _(${porcentaje}%)_`
        }).join('\n\n')
      text += `\n\n> ⌦ Página *${page}* de *${totalPages}*`
      if (page < totalPages)
        text += `\n> Para ver la siguiente página › *${usedPrefix + command} ${page + 1}*`
      await client.sendMessage(m.chat, { text }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}
