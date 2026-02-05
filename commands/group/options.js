export default {
  command: [
    'welcome', 'bienvenida',
    'goodbye', 'despedida',
    'alerts', 'alertas',
    'nsfw',
    'antilink', 'antienlaces', 'antilinks',
    'rpg', 'economy', 'economia',
    'gacha',
    'adminonly', 'onlyadmin'
  ],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const chatData = global.db.data.chats[m.chat]
    const botname = global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].botname 
    const stateArg = args[0]?.toLowerCase()
    const validStates = ['on', 'off', 'enable', 'disable']
    const mapTerms = {
      antilinks: 'antilinks',
      antienlaces: 'antilinks',
      antilink: 'antilinks',
      welcome: 'welcome',
      bienvenida: 'welcome',
      goodbye: 'goodbye',
      despedida: 'goodbye',
      alerts: 'alerts',
      alertas: 'alerts',
      economy: 'economy',      
      economia: 'economy',
      adminonly: 'adminonly',
      onlyadmin: 'adminonly',
      nsfw: 'nsfw',
      rpg: 'gacha',
      gacha: 'gacha'
    }
    const featureNames = {
      antilinks: 'el *AntiEnlace*',
      welcome: 'el mensaje de *Bienvenida*',
      goodbye: 'el mensaje de *Despedida*',
      alerts: 'las *Alertas*',
      economy: 'los comandos de *Economía*',
      gacha: 'los comandos de *Gacha*',
      adminonly: 'el modo *Solo Admin*',
      nsfw: 'los comandos *NSFW*'
    }
    const featureTitles = {
      antilinks: 'AntiEnlace',
      welcome: 'Bienvenida',
      goodbye: 'Despedida',
      alerts: 'Alertas',
      economy: 'Economía',
      gacha: 'Gacha',
      adminonly: 'AdminOnly',
      nsfw: 'NSFW'
    }
    const normalizedKey = mapTerms[command] || command
    const current = chatData[normalizedKey] === true
    const estado = current ? '✓ Activado' : '✗ Desactivado'
    const nombreBonito = featureNames[normalizedKey] || `la función *${normalizedKey}*`
    const titulo = featureTitles[normalizedKey] || normalizedKey
    if (!stateArg) {
      return client.reply(m.chat, `*✩ ${titulo} (✿❛◡❛)*\n\nꕥ Un administrador puede activar o desactivar ${nombreBonito} utilizando:\n\n● _Habilitar ›_ *${usedPrefix + normalizedKey} enable*\n● _Deshabilitar ›_ *${usedPrefix + normalizedKey} disable*\n\n❒ *Estado actual ›* ${estado}`, m)
    }
    if (!validStates.includes(stateArg)) {
      return m.reply(`✎ Estado no válido. Usa *on*, *off*, *enable* o *disable*\n\nEjemplo:\n${usedPrefix}${normalizedKey} enable`)
    }
    const enabled = ['on', 'enable'].includes(stateArg)
    if (chatData[normalizedKey] === enabled) {
      return m.reply(`✎ *${titulo}* ya estaba *${enabled ? 'activado' : 'desactivado'}*.`)
    }
    chatData[normalizedKey] = enabled
    return m.reply(`✎ Has *${enabled ? 'activado' : 'desactivado'}* ${nombreBonito}.`)
  }
};