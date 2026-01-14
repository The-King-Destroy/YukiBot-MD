export default {
  command: ['open', 'abrir'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const timeout = args[0] ? msParser(args[0]) : 0
      if (args[0] && !timeout) {
        return client.reply(m.chat, 'Formato inválido. Usa por ejemplo: 10s, 5m, 2h, 1d', m)
      }
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupAnnouncement = groupMetadata.announce
      if (groupAnnouncement === false) {
        return client.reply(m.chat, `《✧》 El grupo ya está abierto.`, m)
      }
      const applyAction = async () => {
        await client.groupSettingUpdate(m.chat, 'not_announcement')
        return client.reply(m.chat, `✿ El grupo ha sido abierto correctamente.`, m)
      }
      if (timeout > 0) {
        await client.reply(m.chat, `❀ El grupo se abrirá en ${clockString(timeout)}.`, m)
        setTimeout(async () => {
          try {
            const md = await client.groupMetadata(m.chat)
            if (md.announce === false) return
            await applyAction()
          } catch {}
        }, timeout)
      } else {
        await applyAction()
      }
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}

function msParser(str) {
  const match = str.match(/^(\d+)([smhd])$/i)
  if (!match) return null
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  switch (unit) {
    case 's': return num * 1000
    case 'm': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    default: return null
  }
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  let parts = []
  if (d > 0) parts.push(`${d} ${d === 1 ? 'día' : 'días'}`)
  if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
  if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`)
  if (s > 0) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
  return parts.join(' ')
}