let handler = async (m, { text, usedPrefix, command }) => {
const userId = m.sender
if (command === 'setmeta') {
const packParts = text.split(/[\u2022|]/).map(part => part.trim())
if (packParts.length < 2) {
return m.reply(`❀ Por favor, escribe el pack y el autor que deseas usar por defecto para tus stickers.\n> Ejemplo: *${usedPrefix + command} Ola • Ola*`)
}
const packText1 = packParts[0]
const packText2 = packParts[1]
if (!global.db.data.users[userId]) {
global.db.data.users[userId] = {}
}
const packstickers = global.db.data.users[userId]
packstickers.text1 = packText1
packstickers.text2 = packText2
await global.db.write()
return m.reply(`❀ Se actualizo el pack y autor por defecto para tus stickers.`);
}
if (command === 'delmeta') {
if (!global.db.data.users[userId] || (!global.db.data.users[userId].text1 && !global.db.data.users[userId].text2)) {
return m.reply(`ꕥ No tienes establecido un pack de stickers.`)
}
const packstickers = global.db.data.users[userId]
delete packstickers.text1
delete packstickers.text2
await global.db.write()
return m.reply(`❀ Se restablecio el pack y autor por defecto para tus stickers.`)
}}

handler.help = ['setmeta', 'delmeta']
handler.tags = ['tools']
handler.command = ['setmeta', 'delmeta']
handler.group = true

export default handler