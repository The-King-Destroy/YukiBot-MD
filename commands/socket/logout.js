import fs from 'fs';
import path from 'path';
import {jidDecode} from '@whiskeysockets/baileys';

export default {
  command: ['logout'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const rawId = client.user?.id || ''
    const decoded = jidDecode(rawId)
    const cleanId = decoded?.user || rawId.split('@')[0]
    const sessionTypes = ['Subs']
    const basePath = 'Sessions'
    const sessionPath = sessionTypes.map((type) => path.join(basePath, type, cleanId)).find((p) => fs.existsSync(p))
    if (!sessionPath) {
      return m.reply('《✧》 Este comando solo puede ser usado desde una instancia de Sub-Bot.')
    }
    try {
      await m.reply('《✧》 Cerrando sesión del Socket...')
      await client.logout()
      setTimeout(() => {
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true })
          console.log(`《✧》 Sesión de ${cleanId} eliminada de ${sessionPath}`)
        }
      }, 2000)
      setTimeout(() => {
        m.reply(`《✧》 Sesión finalizada correctamente.\nPuedes reconectarte usando *${usedPrefix}code*`)
      }, 3000)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
