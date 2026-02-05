import fetch from 'node-fetch'

export default {
  command: ['ssweb', 'ss'],
  category: ['tools'],
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) return m.reply('❀ Por favor, ingrese el Link de una página.')
      let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
      await client.sendMessage(m.chat, {
        image: ss,
        caption: args[0]
      }, { quoted: m })
    } catch (error) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}
