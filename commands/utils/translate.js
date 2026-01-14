import translate from '@vitalets/google-translate-api'

export default {
  command: ['translate', 'trad', 'traducir'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    const defaultLang = 'es'
    if (!args[0] && !m.quoted) return m.reply('《✧》 Ingresa el idioma seguido del texto que quieras traducir.')
    let lang = args[0]
    let text = args.slice(1).join(' ') || m.quoted?.text
    if ((lang || '').length !== 2) {
      lang = defaultLang
      text = args.join(' ') || m.quoted?.text
    }
    try {
      await m.react('🕒')
      const result = await translate(text, { to: lang, autoCorrect: true })
      await client.sendMessage(m.chat, { text: result.text }, { quoted: m })
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}