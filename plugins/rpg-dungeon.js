let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
if (!user) global.db.data.users[m.sender] = user = { health: 100, coin: 0, exp: 0, lastDungeon: 0 }
if (user.health < 5)
return conn.reply(m.chat, `ꕥ No tienes suficiente salud para volver a la *mazmorra*.\n> Usa *"${usedPrefix}heal"* para curarte.`, m)
const cooldown = 18 * 60 * 1000
const ahora = Date.now()
if (ahora < user.lastDungeon) {
const restante = user.lastDungeon - ahora
const wait = formatTimeMs(restante)
return conn.reply(m.chat, `ꕥ Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m)
}
user.lastDungeon = ahora + cooldown
const evento = pickRandom(eventos)
let monedas, experiencia, salud
if (evento.tipo === 'victoria') {
monedas = Math.floor(Math.random() * 3001) + 12000
experiencia = Math.floor(Math.random() * 71) + 30
salud = Math.floor(Math.random() * 3) + 8
user.coin += monedas
user.exp += experiencia
user.health -= salud
} else if (evento.tipo === 'derrota') {
monedas = Math.floor(Math.random() * 2001) + 6000
experiencia = Math.floor(Math.random() * 31) + 40
salud = Math.floor(Math.random() * 3) + 8
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
const resultado = `❀ ${evento.mensaje} ${evento.tipo === 'trampa' ? '' : evento.tipo === 'victoria' ? `ganaste. *${monedas.toLocaleString()} ${currency}*` : `perdiste. *${monedas.toLocaleString()} ${currency}*`}`
await conn.reply(m.chat, resultado.trim(), m)
await global.db.write()
}

handler.tags = ['rpg']
handler.help = ['dungeon', 'mazmorra']
handler.command = ['dungeon', 'mazmorra']
handler.group = true

export default handler

function formatTimeMs(ms) {
const totalSec = Math.ceil(ms / 1000)
const min = Math.floor(totalSec / 60)
const sec = totalSec % 60
const partes = []
if (min) partes.push(`${min} minuto${min !== 1 ? 's' : ''}`)
partes.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
return partes.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const eventos = [
{ tipo: 'victoria', mensaje: 'Derrotaste al guardián de las ruinas y reclamaste el tesoro antiguo,' },
{ tipo: 'victoria', mensaje: 'Descifraste los símbolos rúnicos y obtuviste recompensas ocultas,' },
{ tipo: 'victoria', mensaje: 'Encuentras al sabio de la mazmorra, quien te premia por tu sabiduría,' },
{ tipo: 'victoria', mensaje: 'El espíritu de la reina ancestral te bendice con una gema de poder,' },
{ tipo: 'victoria', mensaje: 'Superas la prueba de los espejos oscuros y recibes un artefacto único,' },
{ tipo: 'victoria', mensaje: 'Derrotas a un gólem de obsidiana y desbloqueas un acceso secreto,' },
{ tipo: 'victoria', mensaje: 'Salvas a un grupo de exploradores perdidos y ellos te recompensan,' },
{ tipo: 'victoria', mensaje: 'Consigues abrir la puerta del juicio y extraes un orbe milenario,' },
{ tipo: 'victoria', mensaje: 'Triunfas sobre un demonio ilusorio que custodiaba el sello perdido,' },
{ tipo: 'victoria', mensaje: 'Purificas el altar corrompido y recibes una bendición ancestral,' },
{ tipo: 'derrota', mensaje: 'Un espectro maldito te drena energía antes de que puedas escapar,' },
{ tipo: 'derrota', mensaje: 'Un basilisco te sorprende en la cámara oculta, huyes herido,' },
{ tipo: 'derrota', mensaje: 'Una criatura informe te roba parte de tu botín en la oscuridad,' },
{ tipo: 'derrota', mensaje: 'Fracasas al invocar un portal y quedas atrapado entre dimensiones,' },
{ tipo: 'derrota', mensaje: 'Pierdes el control de una reliquia y provocas tu propia caída,' },
{ tipo: 'trampa', mensaje: 'Activaste una trampa, pero logras evitar el daño y aprendes algo nuevo.' },
{ tipo: 'trampa', mensaje: 'La sala cambia de forma y pierdes tiempo explorando en círculos.' },
{ tipo: 'trampa', mensaje: 'Caes en una ilusión, fortaleces tu mente sin obtener riquezas.' }
]