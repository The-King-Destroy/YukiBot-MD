import { readdirSync, unlinkSync, existsSync, promises as fs, statSync } from 'fs'
import { tmpdir } from 'os'
import path, { join } from 'path'

const handler = async (m, { conn, __dirname, command, usedPrefix, isROwner }) => {
if (!isROwner) return
try {
switch (command) {
case 'delai': case 'dsowner': {
if (global.conn.user.jid !== conn.user.jid) {
return conn.reply(m.chat, '❀ Utiliza este comando directamente en el número principal del Bot.', m)
}
const sessionPath = `./${sessions}/`
if (!existsSync(sessionPath)) return conn.reply(m.chat, 'ꕥ La carpeta de sesión está vacía.', m)
await m.react('🕒')
const files = await fs.readdir(sessionPath)
let filesDeleted = 0
for (const file of files) {
if (file !== 'creds.json') {
await fs.unlink(path.join(sessionPath, file))
filesDeleted++
}}
if (filesDeleted === 0) {
await conn.reply(m.chat, 'ꕥ La carpeta de sesión no contenía archivos eliminables.', m)
} else {
await m.react('✔️')
await conn.reply(m.chat, `❀ Se eliminaron ${filesDeleted} archivos de sesión, excepto el archivo creds.json.`, m)
}
break
}
case 'cleartmp': case 'vaciartmp': {
await m.react('🕒')
const tmpPaths = [tmpdir(), join(__dirname, '../tmp')]
let totalDeleted = 0
for (const dirname of tmpPaths) {
const files = readdirSync(dirname)
for (const file of files) {
const fullPath = join(dirname, file)
const stats = statSync(fullPath)
if (stats.isDirectory()) continue
unlinkSync(fullPath)
totalDeleted++
}}
await m.react('✔️')
conn.reply(m.chat, `❀ Listo, se eliminaron ${totalDeleted} archivos de las carpetas temporales.`, m)
break
}}} catch (err) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${err.message}`, m)
}}

handler.help = ['delai', 'dsowner', 'cleartmp', 'vaciartmp']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'cleartmp', 'vaciartmp']

export default handler
