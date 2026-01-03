const pHora = 1000
const pDia = 10000
const pSemana = 25000
const pMes = 50000

const cHora = 20
const cDia = 200
const cSemana = 500
const cMes = 1000

let handler = async (m, { conn, usedPrefix, command, args }) => {
let texto = `✐ Opciones disponibles para comprar premium:

° *h :* Horas = ${pHora} ${currency}
° *d :* Días = ${pDia} ${currency}
° *s :* Semanas = ${pSemana} ${currency}
° *m :* Meses = ${pMes} ${currency}

✧ Ejemplo :
${usedPrefix + command} 1 h ---> 1 hora premium.
${usedPrefix + command} 2 d ---> 2 días premium.
${usedPrefix + command} 1 s ---> 1 semana premium.
${usedPrefix + command} 1 m ---> 1 mes premium.`
if (!args[0]) return conn.reply(m.chat, texto, fkontak)
let user = global.db.data.users[m.sender]
let name = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
if (isNaN(args[0])) return conn.reply(m.chat, `ꕥ Solo se aceptan números.\n> Ejemplo: *${usedPrefix + command} 1 h*`, m)
let kk = args[1]?.toLowerCase() || "h"
let precios = { h: pHora, d: pDia, s: pSemana, m: pMes }
let comisiones = { h: cHora, d: cDia, s: cSemana, m: cMes }
if (!precios[kk]) return conn.reply(m.chat, `ꕥ Formato no válido. Opciones: h, d, s, m`, m)
let precio = precios[kk]
let comision = comisiones[kk]
let total = (precio * args[0]) + (comision * args[0])
if (user.coin < total) return conn.reply(m.chat, `ꕥ No tienes suficientes ${currency} para comprar la membresía premium!`, m)
let tiempoMs = { h: 3600000, d: 86400000, s: 604800000, m: 2592000000 }[kk] * args[0]
let now = Date.now()
if (now < user.premiumTime) user.premiumTime += tiempoMs
else user.premiumTime = now + tiempoMs
user.premium = true
user.coin -= total
let tipos = { h: "Hora(s)", d: "Día(s)", s: "Semana(s)", m: "Mes(es)" }
let tipo = tipos[kk]
let cap = `  \`\`\`乂 ¡BUY  -  PREMIUM! 乂\`\`\`

ᰔᩚ Usuario » ${name}
ⴵ Tiempo Premium » ${args[0]} ${tipo}
✦ Total a pagar » ${total} ${currency}
⛁ ${currency} » ${user.coin}
✰ Tenía » ${user.coin + total}
✧ Comisión » -${comision * args[0]} (incluida)`
conn.sendMessage(m.chat, { text: cap, mentions: [m.sender] }, { quoted: fkontak })
}

handler.tags = ['rg']
handler.help = ['premium']
handler.command = ['vip', 'premium', 'prem']

export default handler