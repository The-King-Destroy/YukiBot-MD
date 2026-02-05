export default {
  command: ['afk'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
  const userData = global.db.data.chats[m.chat].users[m.sender]
  userData.afk = Date.now()
  userData.afkReason = args.join(' ')
  const nombre = global.db.data.users[m.sender]?.name || 'Usuario'
  const motivo = args.length ? `${args.join(' ')}` : 'Sin Especificar!'
  return await client.reply(m.chat, `ꕥ El Usuario *${nombre}* estará AFK.\n> ○ Motivo » *${motivo}*`, m)
  }
}
