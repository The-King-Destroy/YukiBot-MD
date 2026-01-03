var handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
let now = Date.now()
let gap = 86400000
user.lastcofre = user.lastcofre || 0
user.coin = user.coin || 0
user.exp = user.exp || 0
if (now < user.lastcofre) {
let wait = formatTime(Math.floor((user.lastcofre - now) / 1000))
return conn.reply(m.chat, `ꕥ Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m)
}
let reward = Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000
let expGain = Math.floor(Math.random() * (111)) + 50
user.coin += reward
user.exp += expGain
user.lastcofre = now + gap
conn.reply(m.chat, `「✿」 ${pickRandom(cofres)}\n> Has recibido *¥${reward.toLocaleString()} ${currency}*.`, m)
}

handler.help = ['cofre']
handler.tags = ['economía']
handler.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir']
handler.group = true

export default handler

function formatTime(totalSec) {
const h = Math.floor(totalSec / 3600)
const m = Math.floor((totalSec % 3600) / 60)
const s = totalSec % 60
const txt = []
if (h > 0) txt.push(`${h} hora${h !== 1 ? 's' : ''}`)
if (m > 0 || h > 0) txt.push(`${m} minuto${m !== 1 ? 's' : ''}`)
txt.push(`${s} segundo${s !== 1 ? 's' : ''}`)
return txt.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const cofres = [
"Has encontrado un cofre antiguo en un barco hundido.",
"Descubriste un cofre decorado con intrincados grabados en una isla desierta.",
"Te topaste con un cofre mágico que se abre con una palabra secreta.",
"Encontraste un cofre de madera desgastada lleno de monedas de oro.",
"Desenterraste un cofre cubierto de lianas en una selva espesa.",
"Te adentraste en una cueva y hallaste un cofre lleno de joyas brillantes.",
"Un cofre misterioso apareció en la playa, lleno de tesoros de otro tiempo.",
"Descubriste un cofre escondido detrás de una cascada, rebosante de piedras preciosas.",
"Te topaste con un cofre encantado que guarda la historia de antiguos aventureros.",
"Encontraste un cofre de hierro forjado, custodiado por un viejo dragón.",
"Desenterraste un cofre en una tumba antigua que contenía reliquias sagradas.",
"Te encontraste con un cofre que, al abrirlo, libera una nube de polvo dorado.",
"Hallaste un cofre en el fondo de un lago, cubierto de algas y misterios.",
"Te topaste con un cofre que emana una luz mágica en la oscuridad.",
"Descubriste un cofre de cristal tallado, lleno de artefactos de poder.",
"Encontraste un cofre en un desván polvoriento, repleto de cartas y recuerdos.",
"Te adentraste en una fortaleza y hallaste un cofre lleno de armas antiguas.",
"Desenterraste un cofre en un campo de batalla, lleno de tesoros de guerreros caídos.",
"Te topaste con un cofre que se abre solo al resolver un enigma.",
"Encontraste un cofre de madera noble, lleno de joyas de culturas perdidas."
]