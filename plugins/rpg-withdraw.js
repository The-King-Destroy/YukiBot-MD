let handler = async (m, { args, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
if (!args[0]) return m.reply(`❀ Ingresa la cantidad de *${currency}* que deseas retirar.`)
if (args[0] == 'all') {
let count = parseInt(user.bank)
user.bank -= count * 1
user.coin += count * 1
await m.reply(`❀ Retiraste *¥${count.toLocaleString()} ${currency}* del banco, ahora podras usarlo pero tambien podran robartelo.`)
return !0
}
if (!Number(args[0])) return m.reply(`ꕥ Debes retirar una cantidad válida.\n > Ejemplo 1 » *${usedPrefix + command} ¥25000*\n> Ejemplo 2 » *${usedPrefix + command} all*`)
let count = parseInt(args[0])
if (!user.bank) return m.reply(`ꕥ No tienes suficientes *${currency}* en el Banco.`)
if (user.bank < count) return m.reply(`ꕥ Solo tienes *¥${user.bank.toLocaleString()} ${currency}* en el Banco.`)
user.bank -= count * 1
user.coin += count * 1
await m.reply(`❀ Retiraste *¥${count.toLocaleString()} ${currency}* del banco, ahora podras usarlo pero tambien podran robartelo.`)}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'with']
handler.group = true

export default handler