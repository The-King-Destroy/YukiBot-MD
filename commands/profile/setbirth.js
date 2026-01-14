import moment from 'moment'
moment.locale('es')

export default {
  command: ['setbirth'],
  category: 'profile',
  run: async (client, m, args, usedPrefix, command) => {
    const user = global.db.data.users[m.sender]
    const currentYear = new Date().getFullYear()
    const input = args.join(' ')
    if (!input)return m.reply(`《✧》 Debes ingresar una fecha válida para tu cumpleaños.\n✐ Ejemplos:\n> ${usedPrefix + command} *01/01/2000* (día/mes/año)\n> ${usedPrefix + command} *01/01* (día/mes/año)`)    
    const birth = validarFechaNacimiento(input, currentYear, usedPrefix, command)
    if (typeof birth === 'string' && birth.startsWith('✦'))
      return m.reply(birth)
    if (!birth)
      return m.reply(`《✧》 Fecha inválida. Usa › *${usedPrefix + command} 01/01/2000*`)
    user.birth = birth
    return m.reply(`✎ Se ha establecido tu fecha de nacimiento como: *${user.birth}*`)
  },
}

function validarFechaNacimiento(text, currentYear, usedPrefix, command) {
  const formatos = ['DD/MM/YYYY', 'DD/MM', 'D MMM', 'D MMM YYYY']
  let fecha = null
  for (const formato of formatos) {
    const f = moment(text, formato, true)
    if (f.isValid()) {
      fecha = f
      break
    }
  }
  if (!fecha) return null
  if (!/\d{4}/.test(text)) {
    fecha.year(currentYear)
  }
  const año = fecha.year()
  const edad = currentYear - año
  if (año > currentYear) {
    return `✦ El año no puede ser mayor a ${currentYear}. Ejemplo: ${usedPrefix + command} 01/12/${currentYear}`
  }
  if (edad > 120) {
    return `✦ La fecha establecida es invalida.`
  }
  if (!fecha.isValid()) return null
  const diaSemana = fecha.format('dddd')
  const dia = fecha.date()
  const mes = fecha.format('MMMM')
  return `${diaSemana}, ${dia} de ${mes} de ${año}`
}