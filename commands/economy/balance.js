import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['balance', 'bal', 'coins', 'bank'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency
    if (chatData.adminonly || !chatData.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat);
    if (!(who in db.chats[m.chat].users)) {
      return m.reply(`「✎」 El usuario mencionado no está registrado en el bot.`)
    }
    const user = chatData.users[who]
    const total = (user.coins || 0) + (user.bank || 0)
    const bal = `✿ Usuario \`<${global.db.data.users[who].name}>\`

⛀ Cartera › *¥${user.coins?.toLocaleString() || 0} ${monedas}*
⚿ Banco › *¥${user.bank?.toLocaleString() || 0} ${monedas}*
⛁ Total › *¥${total.toLocaleString()} ${monedas}*

> _Para proteger tu dinero, ¡depósitalo en el banco usando ${usedPrefix}deposit!_`
    await client.sendMessage(chatId, { text: bal }, { quoted: m })
  }
};