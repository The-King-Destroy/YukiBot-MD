let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
if (!user) global.db.data.users[m.sender] = user = { coin: 0, exp: 0, health: 100, lastAdventure: 0 }
if (user.coin == null) user.coin = 0
if (user.exp == null) user.exp = 0
if (user.health == null) user.health = 100
if (user.lastAdventure == null) user.lastAdventure = 0
if (user.health < 5)
return conn.reply(m.chat, `ꕥ No tienes suficiente salud para volver a *aventurarte*.\n> Usa *"${usedPrefix}heal"* para curarte.`, m)
const cooldown = 20 * 60 * 1000
const now = Date.now()
if (now < user.lastAdventure) {
const restante = user.lastAdventure - now
const wait = formatTime(restante)
return conn.reply(m.chat, `ꕥ Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m)
}
user.lastAdventure = now + cooldown
const evento = pickRandom(aventuras)
let monedas, experiencia, salud
if (evento.tipo === 'victoria') {
monedas = Math.floor(Math.random() * 3001) + 15000
experiencia = Math.floor(Math.random() * 81) + 40
salud = Math.floor(Math.random() * 6) + 10
user.coin += monedas
user.exp += experiencia
user.health -= salud
} else if (evento.tipo === 'derrota') {
monedas = Math.floor(Math.random() * 2001) + 7000
experiencia = Math.floor(Math.random() * 41) + 40
salud = Math.floor(Math.random() * 6) + 10
user.coin -= monedas
user.exp -= experiencia
user.health -= salud
if (user.coin < 0) user.coin = 0
if (user.exp < 0) user.exp = 0
} else {
experiencia = Math.floor(Math.random() * 61) + 30
user.exp += experiencia
}
if (user.health < 0) user.health = 0
const resultado = `❀ ${evento.mensaje} ${evento.tipo === 'neutro' ? '' : evento.tipo === 'victoria' ? `ganaste. *¥${monedas.toLocaleString()} ${currency}*` : `perdiste. *¥${monedas.toLocaleString()} ${currency}*`}`
await conn.reply(m.chat, resultado, m)
await global.db.write()
}

handler.tags = ['rpg']
handler.help = ['adventure', 'aventura']
handler.command = ['adventure', 'aventura']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const min = Math.floor((totalSec % 3600) / 60)
const sec = totalSec % 60
const txt = []
if (min > 0) txt.push(`${min} minuto${min !== 1 ? 's' : ''}`)
txt.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
return txt.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const aventuras = [
{ tipo: 'victoria', mensaje: 'Derrotaste a un ogro emboscado entre los árboles de Drakonia,' },
{ tipo: 'victoria', mensaje: 'Te conviertes en campeón del torneo de gladiadores de Valoria,' },
{ tipo: 'victoria', mensaje: 'Rescatas un libro mágico del altar de los Susurros,' },
{ tipo: 'victoria', mensaje: 'Liberas a aldeanos atrapados en las minas de Ulderan tras vencer a los trolls,' },
{ tipo: 'victoria', mensaje: 'Derrotas a un dragón joven en los acantilados de Flamear,' },
{ tipo: 'victoria', mensaje: 'Encuentras un relicario sagrado en las ruinas de Iskaria y lo proteges de saqueadores,' },
{ tipo: 'victoria', mensaje: 'Triunfas en el duelo contra el caballero corrupto de Invalion,' },
{ tipo: 'victoria', mensaje: 'Conquistas la fortaleza maldita de las Sombras Rojas sin sufrir bajas,' },
{ tipo: 'victoria', mensaje: 'Te infiltras en el templo del Vacío y recuperas el cristal del equilibrio,' },
{ tipo: 'victoria', mensaje: 'Resuelves el acertijo de la cripta eterna y obtienes un tesoro legendario,' },
{ tipo: 'derrota', mensaje: 'El hechicero oscuro te lanzó una maldición y huyes perdiendo recursos,' },
{ tipo: 'derrota', mensaje: 'Te extravías en la jungla de Zarkelia y unos bandidos te asaltan,' },
{ tipo: 'derrota', mensaje: 'Un basilisco te embiste y escapas herido sin botín,' },
{ tipo: 'derrota', mensaje: 'Fracasa tu incursión a la torre de hielo cuando caes en una trampa mágica,' },
{ tipo: 'derrota', mensaje: 'Pierdes orientación entre los portales del bosque espejo y terminas sin recompensa,' },
{ tipo: 'neutro', mensaje: 'Exploras ruinas antiguas y aprendes secretos ocultos sin hallar tesoros.' },
{ tipo: 'neutro', mensaje: 'Sigues la pista de un espectro pero desaparece entre la niebla.' },
{ tipo: 'neutro', mensaje: 'Acompañas a una princesa por los desiertos de Thaloria sin contratiempos.' }
]