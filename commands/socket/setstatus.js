export default {
  command: ['setstatus'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return m.reply(mess.socket)
    const value = args.join(' ').trim()
    if (!value) return m.reply(`✐ Debes escribir un estado valido.\n> Ejemplo: *${usedPrefix + command} Hola! soy Sherry Barnet*`)
    await client.updateProfileStatus(value)
    return m.reply(`✿ Se ha actualizado el estado del bot a *${value}*!`)
  },
};