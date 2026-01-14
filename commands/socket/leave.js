export default {
  command: ['leave'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isOwner = db.settings[botId]?.owner
    const isSocketOwner = [botId, ...(isOwner ? [isOwner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isSocketOwner) return m.reply(mess.socket)
    const groupId = args[0] || m.chat
    try {
      await client.groupLeave(groupId)
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
