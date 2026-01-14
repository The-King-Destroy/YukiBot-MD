export default {
  command: ['todos', 'invocar', 'tagall'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    const groupInfo = await client.groupMetadata(m.chat)
    const participants = groupInfo.participants
    const pesan = args.join(' ')
    let teks = `﹒⌗﹒🌱 .ৎ˚₊‧  ${pesan || 'Revivan 🪴'}\n\n𐚁 ֹ ִ \`GROUP TAG\` ! ୧ ֹ ִ🍃\n\n🍄 \`Miembros :\` ${participants.length}\n🌿 \`Solicitado por :\` @${m.sender.split('@')[0]}\n\n` +
      `╭┄ ꒰ \`Lista de usuarios:ׄ\` ꒱ ┄\n`
    for (const mem of participants) {
      teks += `┊ꕥ @${mem.id.split('@')[0]}\n`
    }
    teks += `╰⸼ ┄ ┄ ꒰ \`${version}\` ꒱ ┄ ┄⸼`
    return client.reply(m.chat, teks, m, { mentions: [m.sender, ...participants.map(p => p.id)] })
  }
}