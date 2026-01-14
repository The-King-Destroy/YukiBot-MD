import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function reloadCommands(dir = path.join(__dirname, '..')) {
  const commandsMap = new Map()
  async function readCommands(folder) {
    const files = fs.readdirSync(folder)
    for (const file of files) {
      const fullPath = path.join(folder, file)
      if (fs.lstatSync(fullPath).isDirectory()) {
        await readCommands(fullPath)
      } else if (file.endsWith('.js')) {
        try {
          const { default: cmd } = await import(fullPath + '?update=' + Date.now()) // fuerza recarga
          if (cmd?.command) {
            cmd.command.forEach((c) => {
              commandsMap.set(c.toLowerCase(), cmd)
            })
          }
        } catch (err) {
          console.error(`Error recargando comando ${file}:`, err)
        }
      }
    }
  }
  await readCommands(dir)
  global.comandos = commandsMap
}

export default {
  command: ['fix', 'update'],
  isOwner: true,
  run: async (client, m) => {
    exec('git pull', async (error, stdout, stderr) => {
      await reloadCommands(path.join(__dirname, '..'))
      let msg = ''
      if (stdout.includes('Already up to date.')) {
        msg = 'ꕥ *Estado:* Todo está actualizado'
      } else {
        msg = `*Actualización completada*\n\n${stdout}`
      }
      await client.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m })
    })
  }
}
