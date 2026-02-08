function msToTime(duration) {    
  const milliseconds = parseInt((duration % 1000) / 100)    
  let seconds = Math.floor((duration / 1000) % 60)    
  let minutes = Math.floor((duration / (1000 * 60)) % 60)    
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)    
  hours = hours < 10 ? '0' + hours : hours    
  minutes = minutes < 10 ? '0' + minutes : minutes    
  seconds = seconds < 10 ? '0' + seconds : seconds    
  return `${minutes} Minuto(s) ${seconds} Segundo(s)`    
}    
    
const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+[0-9]{1,3})?/i    
    
async function getGroupName(client, chatId) {    
  try {    
    const metadata = await client.groupMetadata(chatId)    
    return metadata.subject || 'Grupo desconocido'    
  } catch {    
    return 'Chat privado'    
  }    
}    
    
export default {    
  command: ['invite', 'invitar', 'aceptar'],    
  category: 'info',    
  run: async (client, m, args) => {    
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'    
    const botSettings = global.db.data.settings[botId]    
    const dueño = botSettings.owner    
    
    if (m.quoted && /^aceptar$/i.test(args.join(' ')) && (m.sender === dueño || global.owner.includes(m.sender))) {    
      const text = m.quoted.text || ''    
      const match = text.match(linkRegex)    
      if (match && match[1]) {    
        await client.groupAcceptInvite(match[1])    
        return m.reply('❀ Invitación aceptada. El bot ya entró al grupo.')    
      }    
    }    
    
    const user = global.db.data.chats[m.chat].users[m.sender]    
    const grupo = m.isGroup ? await getGroupName(client, m.chat) : 'Chat privado'    
    const botname = botSettings.botname    
    const cooldown = 600000    
    const nextTime = user.jointime + cooldown    
    if (new Date() - user.jointime < cooldown) {    
      return m.reply(`ꕥ Espera *${msToTime(nextTime - new Date())}* para volver a enviar otra invitacion.`)    
    }    
    const link = args.join(' ')    
    const match = link.match(linkRegex)    
    if (!match || !match[1]) {    
      return m.reply('《✧》 El enlace ingresado no es válido o está incompleto.')    
    }    
    if (!args || !args.length) {    
      return m.reply('《✧》 Ingresa el enlace para invitar al bot a tu grupo.')    
    }    
    const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net'    
    const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot'    
    const pp = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://cdn.yuki-wabot.my.id/files/nufq.jpeg')    
    const sugg = `❀ 𝗦𝗢𝗟𝗜𝗖𝗜𝗧𝗨𝗗 𝗥𝗘𝗖𝗜𝗕𝗜𝗗𝗔    
        
✩ *Usuario ›* ${global.db.data.users[m.sender].name}    
✿ *Enlace ›* ${args.join(' ')}    
✿ *Chat ›* ${grupo}    
    
➤ 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧    
♡ *Socket ›* ${botType}    
★ *Nombre ›* ${botname}    
❐ *Versión ›* ${version}

> ➤ Responde a "aceptar" si desea agregar al bot al grupo solicitado.`    
    if (typeof sugg !== 'string' || !sugg.trim()) return    
    if (isOficialBot) {    
      for (const num of global.owner) {    
        try {    
        await global.client.sendContextInfoIndex(`${num}@s.whatsapp.net`, sugg, {}, null, false, null, { banner: pp, title: 'ꕥ Invitación', body: '✿ New invitation to the Sokect.', redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link })    
        } catch {}    
      }    
    } else {    
      const destino = dueño || botId    
      try {    
      await global.client.sendContextInfoIndex(destino, sugg, {}, null, false, null, { banner: pp, title: 'ꕥ Invitación', body: '✿ New invitation to the Sokect.', redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link })    
      } catch {}    
    }    
    await client.reply(m.chat, '❀ El enlace fue enviado correctamente. ¡Gracias por tu invitación! ฅ^•ﻌ•^ฅ', m)    
    user.jointime = new Date() * 1    
  },    
}
