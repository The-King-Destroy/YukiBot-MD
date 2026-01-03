import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import { execSync } from 'child_process'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })
let handler = async (m, { conn }) => {
let totalUsers = Object.keys(global.db.data.users).length
let totalChats = Object.keys(global.db.data.chats).length
let totalPlugins = Object.values(global.plugins).filter((v) => v.help && v.tags).length
let totalBots = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== 3).length
let totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.commands || 0), 0)
let system = `*「✦」Estado del Sistema*\n\n◇ *Comandos ejecutados* » ${toNum(totalCommands)}\n◇ *Usuarios registrados* » ${totalUsers.toLocaleString()}\n◇ *Grupos registrados* » ${totalChats.toLocaleString()}\n◇ *Plugins* » ${totalPlugins}\n◇ *Bots Activos* » ${totalBots}\n\n❍ *Estado del Servidor*\n\n◆ *Sistema* » ${platform()}\n◆ *CPU* » ${_cpus().length} cores\n◆ *RAM* » ${format(totalmem())}\n◆ *RAM Usado* » ${format(totalmem() - freemem())}\n◆ *Arquitectura* » ${process.arch}\n◆ *Host ID* » ${hostname().slice(0, 8)}...\n\n*❑ Uso de Memoria NODEJS*\n\n◈ *Ram Utilizada* » ${format(process.memoryUsage().rss)}\n◈ *Heap Reservado* » ${format(process.memoryUsage().heapTotal)}\n◈ *Heap Usado* » ${format(process.memoryUsage().heapUsed)}\n◈ *Módulos Nativos* » ${format(process.memoryUsage().external)}\n◈ *Buffers de Datos* » ${format(process.memoryUsage().arrayBuffers)}`
await conn.reply(m.chat, system, m, rcanal)
}

handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status']

export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()
}}
