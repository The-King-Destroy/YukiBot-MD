const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
const pesan = args.join` `
const oi = `*» INFO :* ${pesan}`
let teks = `*!  MENCION GENERAL  !*\n  *PARA ${participants.length} MIEMBROS* 🗣️\n\n ${oi}\n\n╭  ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botname}≼᳞ׄ\` ꒱ ۟ 𝅄 ┄\n`
for (const mem of participants) {
teks += `┊ꕥ @${mem.id.split('@')[0]}\n`
}
teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${vs}* ୧ ׅ ꒱  ┄  ─ ┄⸼`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) })
}

handler.help = ['todos']
handler.tags = ['group']
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true
handler.group = true

export default handler