import { execSync } from 'child_process'

var handler = async (m, { conn, text, isROwner }) => {
if (!isROwner) return
await m.react('🕒')
try {
const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
let messager = stdout.toString()
if (messager.includes('❀ Ya está cargada la actualización.')) messager = '❀ Los datos ya están actualizados a la última versión.'
if (messager.includes('ꕥ Actualizando.')) messager = '❀ Procesando, espere un momento mientras me actualizo.\n\n' + stdout.toString()
await m.react('✔️')
conn.reply(m.chat, messager, m)
} catch { 
try {
const status = execSync('git status --porcelain')
if (status.length > 0) {
const conflictedFiles = status.toString().split('\n').filter(line => line.trim() !== '').map(line => {
if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('database.json') || line.includes('sessions/Principal/') || line.includes('npm-debug.log')) {
return null
}
return '*→ ' + line.slice(3) + '*'}).filter(Boolean)
if (conflictedFiles.length > 0) {
const errorMessage = `\`⚠︎ No se pudo realizar la actualización:\`\n\n> *Se han encontrado cambios locales en los archivos del bot que entran en conflicto con las nuevas actualizaciones del repositorio.*\n\n${conflictedFiles.join('\n')}.`
await conn.reply(m.chat, errorMessage, m)
await m.react('✖️')
}}} catch (error) {
console.error(error)
let errorMessage2 = '⚠︎ Ocurrió un error inesperado.'
if (error.message) {
errorMessage2 += '\n⚠︎ Mensaje de error: ' + error.message
}
await conn.reply(m.chat, errorMessage2, m)
}}}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'fix', 'actualizar']

export default handler
