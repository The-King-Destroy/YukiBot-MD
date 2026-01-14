export default {
  command: ['ping', 'p'],
  category: 'info',
  run: async (client, m) => {
    const start = Date.now()
    const sent = await client.sendMessage(m.chat, { text: '`❏ ¡Pong!`' + `\n> *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot}*`}, { quoted: m })
    const latency = Date.now() - start
    await client.sendMessage(m.chat, { text: `✿ *Pong!*\n> Tiempo ⴵ ${latency}ms`, edit: sent.key }, { quoted: m })
  },
};