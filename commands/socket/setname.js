export default {
  command: ['setbotname', 'setname'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return m.reply(mess.socket)
    const value = args.join(' ').trim()
    if (!value) return m.reply(`✐ Debes escribir un nombre corto y un nombre largo valido.\n> Ejemplo: *${usedPrefix + command} Sherry / Sherry Barnet*`)
    const formatted = value.replace(/\s*\/\s*/g, '/')
    let [short, long] = formatted.includes('/') ? formatted.split('/') : [value, value]
    if (!short || !long) return m.reply('✎ Usa el formato: Nombre Corto / Nombre Largo')
    if (/\s/.test(short)) return m.reply('❖ El nombre corto no puede contener espacios.')
    config.namebot = short.trim()
    config.botname = long.trim()
    return m.reply(`✿ El nombre del bot ha sido actualizado!\n\n❒ Nombre corto: *${short.trim()}*\n❒ Nombre largo: *${long.trim()}*`)
  },
};