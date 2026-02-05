export default {
  command: ['setgenre'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const user = global.db.data.users[m.sender]
    const input = args.join(' ').toLowerCase()
    if (!input) return m.reply(`《✧》 Debes ingresar un género válido.\n✎ Ejemplos:\n> *${usedPrefix + command} hombre*\n> *${usedPrefix + command} mujer*`)
    const genresList = ['Hombre', 'Mujer', 'Femboy', 'Transgénero', 'Gay', 'Lesbiana', 'No Binario', 'Pansexual', 'Bisexual', 'Asexual']
    let genre = null
    if (!isNaN(input)) {
      const index = parseInt(input) - 1
      if (index >= 0 && index < genresList.length) {
        genre = genresList[index]
      }
    } else {
      const found = genresList.find(g => g.toLowerCase() === input)
      if (found) genre = found
    }
    if (!genre) {
      const opciones = genresList.map((g, i) => `${i + 1}. ${g}`).join('\n')
      return m.reply(`《✧》 Elije un género válido.\n\nOpciones:\n${opciones}`)
    }
    user.genre = genre
    return m.reply(`✎ Se ha establecido tu género como: *${user.genre}*`)
  },
}