export default {
  command: ['clear'],
  category: 'grupo',
  isOwner: true,
  run: async (client, m, args) => {
    const start = Date.now()
    const chat = global.db.data.chats?.[m.chat]
    if (!chat?.users || typeof chat.users !== 'object')
      return m.reply('ꕥ No se encontraron datos del grupo.')
    const LIMITE = 40 * 24 * 60 * 60 * 1000
    const now = Date.now()
    let userList = [], mentions = [], eliminados = 0, waifus = 0, dinero = 0
    for (const jid of Object.keys(chat.users)) {
      if (isPrivileged(jid, m.sender)) continue
      const u = chat.users[jid]
      if (!u || typeof u !== 'object') continue
      u.lastCmd = typeof u.lastCmd === 'number' ? u.lastCmd : 0
      u.coins = typeof u.coins === 'number' ? u.coins : 0
      u.bank = typeof u.bank === 'number' ? u.bank : 0
      u.characters = Array.isArray(u.characters) ? u.characters : []
      chat.characters = typeof chat.characters === 'object' ? chat.characters : {}
      chat.sales = typeof chat.sales === 'object' ? chat.sales : {}
      const delta = now - u.lastCmd
      if (u.lastCmd <= 0 || delta <= LIMITE) continue
      for (const id of u.characters) {
        if (chat.characters?.[id]?.user === jid) delete chat.characters[id]
        if (chat.sales?.[id]?.user === jid) delete chat.sales[id]
        if (chat.users[jid].favorite === id) delete chat.users[jid].favorite
      }
      waifus += u.characters.length
      dinero += u.coins + u.bank
      delete chat.users[jid]
      eliminados++
      const tiempo = u.lastCmd > 0 ? formatTime(delta) : 'sin registro previo'
      userList.push(`@${jid.split('@')[0]} *[${u.characters.length}]* - ${tiempo}`)
      mentions.push(jid)
    }
    if (!eliminados)
      return m.reply('ꕥ No se encontraron usuarios inactivos.\n> ⴵ Tiempo limite: 40 dias')
    const report = ['❀ Se han eliminado los datos de los usuarios inactivos.', `> ♡ Claims eliminados: ${waifus}`, `> ⛁ Coins eliminados: ${dinero.toLocaleString()}`, `> ❖ Usuarios inactivos: ${eliminados}`, `> ⴵ Tiempo límite: 40 días`, `> ❏ El comando se ejecutó en ${getDuration(start)}ms`, '', ...userList,].join('\n')
    await client.sendMessage(m.chat, { text: report, mentions }, { quoted: m })
  },
}

const formatTime = ms => {
  const sec = Math.floor(ms / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [d ? `${d}d` : '', h ? `${h}h` : '', m ? `${m}m` : '', s || (!d && !h && !m) ? `${s}s` : ''].filter(Boolean).join(' ')
}
const getDuration = start => {
  const ms = Date.now() - start
  return ms < 1 ? 1 : ms
}
const normalizeNumber = jid => String(jid).replace(/\D/g, '')
const isPrivileged = (jid, sender) => {
  const n = normalizeNumber(jid)
  if (n === normalizeNumber(sender)) return true
  for (const list of [global.owner, global.mods]) {
    if (!list) continue
    for (const o of list) {
      const id = typeof o === 'string' ? o : Array.isArray(o) ? o[0] : o?.jid
      if (normalizeNumber(id) === n) return true
    }
  }
  return false
}