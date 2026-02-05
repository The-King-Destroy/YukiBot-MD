export default {
  command: ['dep', 'deposit', 'd'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chatData = global.db.data.chats[m.chat]
    const user = chatData.users[m.sender]
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings[idBot]
    const monedas = settings.currency
    if (chatData.adminonly || !chatData.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    if (!args[0]) {
      return m.reply(`《✧》 Ingresa la cantidad de *${monedas}* que quieras *depositar*.`)
    }
    if (args[0] < 1 && args[0].toLowerCase() !== 'all') {
      return m.reply('✎ Ingresa una cantidad *válida* para depositar')
    }
    if (args[0].toLowerCase() === 'all') {
      if (user.coins <= 0) return m.reply(`✎ No tienes *${monedas}* para depositar en tu *banco*`)
      const count = user.coins
      user.coins = 0
      user.bank += count
      await m.reply(`ꕥ Has depositado *¥${count.toLocaleString()} ${monedas}* en tu Banco`)
      return true
    }
    if (!Number(args[0]) || parseInt(args[0]) < 1) {
      return m.reply('《✧》 Ingresa una cantidad *válida* para depositar')
    }
    const count = parseInt(args[0])
    if (user.coins <= 0 || user.coins < count) {
      return m.reply('❀ No tienes suficientes *${monedas}* para depositar')
    }
    user.coins -= count
    user.bank += count
    await m.reply(`ꕥ Has depositado *¥${count.toLocaleString()} ${monedas}* en tu Banco`)
  },
};