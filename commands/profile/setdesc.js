export default {
  command: ['setdescription', 'setdesc'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const user = global.db.data.users[m.sender]
    const input = args.join(' ')
    if (!input) return m.reply(`《✧》 Debes especificar una descripción válida para tu perfil.\n\n> ✐ Ejemplo » *${usedPrefix + command} Hola, uso WhatsApp!*`)
    user.description = input
    return m.reply(`✎ Se ha establecido tu descripcion, puedes revisarla con ${usedPrefix}profile ฅ^•ﻌ•^ฅ`)
  },
};