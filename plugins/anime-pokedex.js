import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
try {
if (!text) return conn.reply(m.chat, `❀ Por favor, ingresa el nombre del Pokemon que quiere buscar.`, m)
const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(text)}`
await m.react('🕒')
const response = await fetch(url)
const json = await response.json()
if (!response.ok) return conn.reply(m.chat, '⚠︎ Ocurrió un error.', m)
const aipokedex = `❀ *Pokedex - Información*\n\n> • *Nombre* » ${json.name}\n> • *ID* » ${json.id}\n> • *Tipo* » ${json.type}\n> • *Habilidades* » ${json.abilities}\n> • *Tamaño* » ${json.height}\n> • *Peso* » ${json.weight}\n> • *Descripción* » ${json.description}\n\n> ¡Encuentra más detalles sobre este Pokémon en la Pokedex!\n\n> https://www.pokemon.com/es/pokedex/${json.name.toLowerCase()}`
conn.reply(m.chat, aipokedex, m)
await m.react('✔️')
} catch (error) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m)
}}

handler.help = ['pokedex']
handler.tags = ['fun']
handler.command = ['pokedex']
handler.group = true

export default handler