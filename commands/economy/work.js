export default {
  command: ['w', 'work', 'chambear', 'chamba', 'trabajar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const chat = db.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const monedas = db.settings[botId].currency
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const cooldown = 3 * 60 * 1000
    user.lastwork = user.lastwork || 0
    if (Date.now() < user.lastwork) {
      const tiempoRestante = formatTime(user.lastwork - Date.now())
      return client.reply(m.chat, `ꕥ Debes esperar *${tiempoRestante}* para usar *${usedPrefix + command}* de nuevo.`, m)
    }
    user.lastwork = Date.now() + cooldown
    const rsl = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000
    user.coins = user.coins || 0
    user.coins += rsl
    await client.sendMessage(m.chat, { text: `❀ ${pickRandom(trabajo)} *¥${rsl.toLocaleString()} ${monedas}*.`, }, { quoted: m })
  }
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const trabajo = [
  "Trabajas como recolector de fresas y ganas",
  "Eres asistente en un taller de cerámica y obtienes",
  "Diseñas páginas web y ganas",
  "Eres fotógrafo de bodas y recibes",
  "Trabajas en una tienda de mascotas y ganas",
  "Eres narrador de audiolibros y obtienes",
  "Hemostras en el departamento de arte y ganas",
  "Trabajas como jardinero en un parque y recibes",
  "Eres un DJ en fiestas y ganas",
  "Hiciste un mural en una cafetería y te dieron",
  "Trabajas como diseñador de interiores y ganas",
  "Eres un conductor de autobús turístico y obtienes",
  "Preparas sushi en un restaurante y ganas",
  "Trabajas como asistente de investigación y recibes",
  "Eres especialista en marketing de contenidos y ganas",
  "Trabajas en una granja orgánica y obtienes",
  "Eres un bailarín en un espectáculo y ganas",
  "Organizas ferias de arte y recibes",
  "Eres un escritor freelance y ganas",
  "Hiciste un diseño gráfico para una campaña y te pagaron",
  "Trabajas como mecánico de automóviles y ganas",
  "Eres un instructor de surf y recibes",
  "Limpias casas como servicio de limpieza y ganas",
  "Eres un técnico de sonido en conciertos y obtienes",
  "Trabajas como desarrollador de aplicaciones y ganas",
  "Eres un croupier en un casino y recibes",
  "Trabajas como estilista de cabello y ganas",
  "Eres un restaurador de arte y obtienes",
  "Trabajas en una librería y ganas",
  "Eres un guía de montañismo y recibes",
  "Llevas un blog de viajes y ganas",
  "Hiciste una campaña de crowdfunding y obtuviste",
  "Trabajas como asistente social y ganas",
  "Eres un conductor de camión de carga y recibes",
  "Trabajas en un equipo de rescate y ganas",
  "Eres un consultor de negocios y obtienes",
  "Realizas catas de vino y ganas",
  "Trabajas como barista en una cafetería y recibes",
  "Eres un entrenador de mascotas y ganas",
  "Hiciste un documental para una ONG y recibiste",
  "Eres un operador de drones y ganas",
  "Trabajas en una productora de cine y obtienes",
  "Eres un investigador de mercados y ganas",
  "Trabajas como repartidor de comida y recibes",
  "Eres un acupunturista y ganas",
  "Hiciste un diseño de joyas y obtuviste",
  "Trabajas como especialista en atención al cliente y ganas",
  "Eres un conservador de museos y recibes",
  "Trabajas en un centro de rehabilitación y obtienes",
  "Eres un piloto de helicóptero y ganas",
  "Hiciste una campaña de concienciación y te dieron",
  "Trabajas en un taller de mecánica y ganas",
  "Eres un organizador de eventos deportivos y recibes",
  "Desarrollas una aplicación educativa y ganas",
  "Eres un técnico en redes informáticas y obtienes",
  "Trabajas como asistente de producción en teatro y ganas",
  "Eres un ilustrador de libros para niños y recibes",
  "Trabajas en un centro de yoga y obtienes",
  "Eres un chef personal y ganas",
  "Realizas un calendario de fotos y recibiste",
  "Eres un promotor de salud y bienestar y ganas",
  "Trabajas como decorador de interiores y recibes",
  "Eres un arreglista floral y ganas",
  "Organizas un festival de música y obtienes",
  "Eres un periodista de investigación y ganas",
  "Trabajas como asistente técnico en un estudio de grabación y recibes",
  "Eres un mecánico de bicicletas y ganas",
  "Hiciste un video viral y obtuviste",
  "Trabajas como investigador de ciencias sociales y ganas",
  "Eres un organizador de conferencias y recibes",
  "Dibujo de caricaturas en eventos y ganas",
  "Eres un responsable de relaciones públicas y obtienes",
  "Trabajas como coach de vida y ganas",
  "Eres un educador en un centro cultural y recibes",
  "Eres un director de fotografía y ganas",
  "Trabajas en un refugio de animales y obtienes",
  "Eres un guía en almuerzos y cenas temáticas y ganas",
  "Hiciste un proyecto de arte comunitario y recibiste",
  "Eres un traductor de documentos y obtienes",
  "Trabajas como asistente personal de un ejecutivo y ganas",
  "Eres un especialista en sostenibilidad y recibes",
  "Realizas un programa de radio y ganas",
  "Trabajas como tasador de arte y obtienes",
  "Eres un creador de contenido en redes sociales y ganas",
  "Hiciste un workshop de manualidades y recibiste"
];