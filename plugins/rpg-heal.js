let handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
if (!user) return conn.reply(m.chat, `ꕥ El usuario no se encuentra en la base de Datos.`, m)
if (user.health >= 100) return conn.reply(m.chat, `❀ Tu salud ya está al máximo.`, m)
if (user.coin <= 0) return conn.reply(m.chat, `ꕥ No tienes ${currency} suficientes para curarte.`, m)
const faltante = 100 - user.health
const disponible = Math.floor(user.coin / 50)
const curable = Math.min(faltante, disponible)
user.health += curable
user.coin -= curable * 50
user.lastHeal = Date.now()
const info = `❀ Te has curado ${curable} punto${curable !== 1 ? 's' : ''} de salud.\n⛁ ${currency} restantes: ¥${user.coin.toLocaleString()}\n♡ Salud actual: ${user.health}`
await conn.sendMessage(m.chat, { text: info }, { quoted: m })
}

handler.help = ['heal']
handler.tags = ['rpg']
handler.command = ['heal', 'curar']
handler.group = true

export default handler