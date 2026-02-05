export default {
  command: ['setwelcome'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    if (!global?.db?.data?.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    const value = text ? text.trim() : ''
    if (!value) {
      return m.reply(`ꕥ Debes enviar un mensaje para establecerlo como mensaje de bienvenida.\n> Puedes usar {usuario}, {grupo} y {desc} como variables dinámicas.\n\n✐ Ejemplo:\n${usedPrefix}setwelcome Bienvenido {usuario} a {grupo}!`)
    }
    chat.sWelcome = value
    return m.reply(`ꕥ Has establecido el mensaje de bienvenida correctamente.`)
  }
}