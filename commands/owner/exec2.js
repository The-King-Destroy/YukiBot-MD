import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'

const exec = promisify(_exec).bind(cp)
export default {
  command: ['r'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    if (!text.trim()) {
      return client.reply(m.chat, '《✧》 Debes escribir un comando a ejecutar.', m)
    }
    let o
    try {
      await m.react('🕒')
      o = await exec(text.trim())
      await m.react('✔️')
    } catch (e) {
      o = e
      await m.react('✖️')
    } finally {
      const { stdout, stderr } = o
      if (stdout?.trim()) client.reply(m.chat, stdout, m)
      if (stderr?.trim()) client.reply(m.chat, stderr, m)
    }
  }
}