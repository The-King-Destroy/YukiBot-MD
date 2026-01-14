export default {
  command: ['trade', 'intercambiar'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db.data
      const chatId = m.chat
      const userId = m.sender
      const chatData = db.chats[chatId] ||= {}
      chatData.users ||= {}
      chatData.characters ||= {}
      if (chatData.adminonly || !chatData.gacha) return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      if (chatData.timeTrade && chatData.timeTrade - Date.now() > 0)
        return m.reply('《✧》 Ya hay un intercambio en curso. Espera a que se complete o expire.')
      if (!args.length || !m.text.includes('/'))
        return m.reply(`❀ Debes especificar dos personajes para intercambiarlos.\n> ✐ Ejemplo: *${usedPrefix + command} Personaje1 / Personaje2*`)
      const raw = m.text.slice(m.text.indexOf(' ') + 1).trim()
      const [nameA, nameB] = raw.split('/').map(s => s.trim().toLowerCase())
      const idA = Object.keys(chatData.characters).find(id => (chatData.characters[id]?.name || '').toLowerCase() === nameA)
      const idB = Object.keys(chatData.characters).find(id => (chatData.characters[id]?.name || '').toLowerCase() === nameB)
      if (!idA || !idB) {
        const missing = !idA ? nameA : nameB
        return m.reply(`ꕥ No se ha encontrado al personaje *${missing}*.`)
      }
      const pA = chatData.characters[idA]
      const pB = chatData.characters[idB]
      const globalA = global.db.data.characters?.[idA] || {}
      const globalB = global.db.data.characters?.[idB] || {}
      const valueA = typeof globalA.value === 'number' ? globalA.value : typeof pA.value === 'number' ? pA.value : 0
      const valueB = typeof globalB.value === 'number' ? globalB.value : typeof pB.value === 'number' ? pB.value : 0
      if (pB.user === userId) return m.reply(`ꕥ El personaje *${pB.name}* ya está reclamado por ti.`)
      if (!pB.user) return m.reply(`ꕥ El personaje *${pB.name}* no está reclamado por nadie.`)
      if (!pA.user || pA.user !== userId) return m.reply(`ꕥ *${pA.name}* no está reclamado por ti.`)
      const receiverId = pB.user
      chatData.intercambios ||= []
      chatData.intercambios.push({ solicitante: userId, personaje1: { id: idA, name: pA.name, value: valueA }, personaje2: { id: idB, name: pB.name, value: valueB }, destinatario: receiverId, expiracion: Date.now() + 60000 })
      chatData.timeTrade = Date.now() + 60000
      const solicitudMessage = `「✿」 ${db.users[receiverId].name || receiverId.split('@')[0]}, ${db.users[userId].name || userId.split('@')[0]} te ha enviado una solicitud de intercambio.\n\n✦ [${db.users[receiverId].name || receiverId.split('@')[0]}] *${pB.name}* (${valueB})\n✦ [${db.users[userId].name || userId.split('@')[0]}] *${pA.name}* (${valueA})\n\n✐ Para aceptar el intercambio responde a este mensaje con "${usedPrefix}aceptar", la solicitud expira en 60 segundos.`
      await client.sendMessage(chatId, { text: solicitudMessage, mentions: [userId, receiverId] }, { quoted: m })
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}