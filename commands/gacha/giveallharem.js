import { promises as fs } from 'fs'
import { resolveLidToRealJid } from '../../lib/utils.js'

const file = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(file, 'utf-8')
  return JSON.parse(data)
}
function flattenCharacters(data) {
  return Object.values(data).flatMap(d => Array.isArray(d.characters) ? d.characters : [])
}
const getDisplayName = (jid) => {
  const dbName = global.db?.data?.users?.[jid]?.name
  return dbName?.trim() || jid.split('@')[0]
}
function agregarRegalo(chat, senderId, targetId, ids, total, count, messageId, chatId) {
  chat.regalosPendientes ||= []
  chat.regalosPendientes.push({ sender: senderId, to: targetId, ids, value: total, count, chatId, messageId, createdAt: Date.now(), expiresAt: Date.now() + 60000 })
}

export default {
  command: ['giveallharem'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat] ||= {}
      chat.users ||= {}
      chat.characters ||= {}
      chat.sales ||= {}
      chat.regalosPendientes ||= []
      const realSender = await resolveLidToRealJid(m.sender, client, m.chat)
      const user = chat.users[realSender] ||= {}
      if (!Array.isArray(user.characters)) user.characters = []
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`)
      }
      const mentionedJid = m.mentionedJid
      const who2 = mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
      const target = await resolveLidToRealJid(who2, client, m.chat)
      if (!target) return m.reply('❀ Debes mencionar a quien quieras regalarle tus personajes.')
      if (!chat.users[target]) return m.reply('ꕥ El usuario mencionado no está registrado.')
      const json = await loadCharacters()
      const all = flattenCharacters(json)
      const ids = user.characters
      const list = ids.map(id => {
        const local = chat.characters[id] || {}
        const ref = all.find(c => c.id === id)
        const value = local.value ?? ref?.value ?? 0
        return { id, name: local.name || ref?.name || `ID:${id}`, value }
      })
      if (!list.length) return m.reply('ꕥ No tienes personajes para regalar.')
      const total = list.reduce((s, c) => s + c.value, 0)
      const nameTarget = getDisplayName(target)
      const nameSender = getDisplayName(realSender)
      const sent = await client.sendMessage(m.chat, { text: `「✿」 *${nameSender}*, ¿confirmas regalar todo tu harem a *${nameTarget}*?\n\n❏ Personajes a transferir: ${list.length}\n❏ Valor total: ${total.toLocaleString()}\n\n✐ Para confirmar responde a este mensaje con "${usedPrefix}aceptar".\n> Esta acción no se puede deshacer, revisa bien los datos antes de confirmar.`, mentions: [target] }, { quoted: m })
      agregarRegalo(chat, realSender, target, list.map(c => c.id), total, list.length, sent.key.id, m.chat)
    } catch (e) {
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}