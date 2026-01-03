import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? await m.quoted.sender : m.sender)
let from = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
let who = await (async () => global.db.data.users[userId].name || (async () => { try { const n = await conn.getName(userId); return typeof n === 'string' && n.trim() ? n : userId.split('@')[0] } catch { return userId.split('@')[0] } })())()
let str, query
switch (command) {
case 'angry': case 'enojado':
str = from === who ? `\`${from}\` está enojado/a! 凸ಠ益ಠ)凸` : `\`${from}\` está enojado/a con \`${who}\`! 凸ಠ益ಠ)凸`
query = 'anime angry'
break
case 'bath': case 'bañarse':
str = from === who ? `\`${from}\` se está bañando! ٩(ˊᗜˋ )و` : `\`${from}\` está bañando a \`${who}\`! ٩(ˊᗜˋ )و`
query = 'anime bath'
break
case 'bite': case 'morder':
str = from === who ? `\`${from}\` se mordió a sí mismo/a! ≽^•⩊•^≼` : `\`${from}\` mordió a \`${who}\`! ≽^•⩊•^≼`
query = 'anime bite'
break
case 'bleh': case 'lengua':
str = from === who ? `\`${from}\` saca la lengua! (｡╹ω╹｡)` : `\`${from}\` le sacó la lengua a \`${who}\`! (｡╹ω╹｡)`
query = 'anime bleh'
break
case 'blush': case 'sonrojarse':
str = from === who ? `\`${from}\` se sonrojó! ( ˶o˶˶o˶)` : `\`${from}\` se sonrojó por \`${who}\`! ( ˶o˶˶o˶)`
query = 'anime blush'
break
case 'bored': case 'aburrido':
str = from === who ? `\`${from}\` está aburrido/a! ( ¬_¬)` : `\`${from}\` está aburrido/a de \`${who}\`! ( ¬_¬)`
query = 'anime bored'
break
case 'clap': case 'aplaudir':
str = from === who ? `\`${from}\` está aplaudiendo! (୨୧•͈ᴗ•͈)` : `\`${from}\` está aplaudiendo por \`${who}\`! (୨୧•͈ᴗ•͈)`
query = 'anime clap'
break
case 'coffee': case 'cafe': case 'café':
str = from === who ? `\`${from}\` está tomando café! ٩(●ᴗ●)۶` : `\`${from}\` está tomando café con \`${who}\`! ٩(●ᴗ●)۶`
query = 'anime coffee'
break
case 'cry': case 'llorar':
str = from === who ? `\`${from}\` está llorando! (╥_╥)` : `\`${from}\` está llorando por \`${who}\`! (╥_╥)`
query = 'anime cry'
break
case 'cuddle': case 'acurrucarse':
str = from === who ? `\`${from}\` se acurrucó con sí mismo/a! ꒰ঌ(˶ˆᗜˆ˵)໒꒱` : `\`${from}\` se acurrucó con \`${who}\`! ꒰ঌ(˶ˆᗜˆ˵)໒꒱`
query = 'anime cuddle'
break
case 'dance': case 'bailar':
str = from === who ? `\`${from}\` está bailando! (ﾉ^ヮ^)ﾉ*:・ﾟ✧` : `\`${from}\` está bailando con \`${who}\`! (ﾉ^ヮ^)ﾉ*:・ﾟ✧`
query = 'anime dance'
break
case 'drunk': case 'borracho':
str = from === who ? `\`${from}\` está borracho! (⸝⸝๑﹏๑⸝⸝)` : `\`${from}\` está borracho con \`${who}\`! (⸝⸝๑﹏๑⸝⸝)`
query = 'anime drunk'
break
case 'eat': case 'comer':
str = from === who ? `\`${from}\` está comiendo! (っ˘ڡ˘ς)` : `\`${from}\` está comiendo con \`${who}\`! (っ˘ڡ˘ς)`
query = 'anime eat'
break
case 'facepalm': case 'palmada':
str = from === who ? `\`${from}\` se da una palmada en la cara! (ভ_ ভ) ރ` : `\`${from}\` se frustra y se da una palmada en la cara por \`${who}\`! (ভ_ ভ) ރ`
query = 'anime facepalm'
break
case 'happy': case 'feliz':
str = from === who ? `\`${from}\` está feliz! ٩(˶ˆᗜˆ˵)و` : `\`${from}\` está feliz por \`${who}\`! ٩(˶ˆᗜˆ˵)و`;
query = 'anime happy';
break
case 'hug': case 'abrazar':
str = from === who ? `\`${from}\` se abrazó a sí mismo/a! (づ˶•༝•˶)づ♡` : `\`${from}\` abrazó a \`${who}\`! (づ˶•༝•˶)づ♡`;
query = 'anime hug'
break
case 'kill': case 'matar':
str = from === who ? `\`${from}\` se mató a sí mismo/a! ( ⚆ _ ⚆ )` : `\`${from}\` mató a \`${who}\`! ( ⚆ _ ⚆ )`
query = 'anime kill'
break
case 'kiss': case 'muak':
str = from === who ? `\`${from}\` se besó a sí mismo/a! ( ˘ ³˘)♥` : `\`${from}\` besó a \`${who}\`! ( ˘ ³˘)♥`
query = 'anime kiss'
break
case 'laugh': case 'reirse':
str = from === who ? `\`${from}\` se ríe! (≧▽≦)` : `\`${from}\` se está riendo de \`${who}\`! (≧▽≦)`
query = 'anime laugh'
break
case 'lick': case 'lamer':
str = from === who ? `\`${from}\` se lamió a sí mismo/a!（＾ω＾）` : `\`${from}\` lamió a \`${who}\`!（＾ω＾）`
query = 'anime lick'
break
case 'slap': case 'bofetada':
str = from === who ? `\`${from}\` se golpeó a sí mismo/a! ᕙ(⇀‸↼‵‵)ᕗ` : `\`${from}\` le dio una bofetada a \`${who}\`! ᕙ(⇀‸↼‵‵)ᕗ`
query = 'anime slap'
break
case 'sleep': case 'dormir':
str = from === who ? `\`${from}\` está durmiendo profundamente! (∪｡∪)｡｡｡zzz` : `\`${from}\` duerme junto a \`${who}\`! (∪｡∪)｡｡｡zzz`
query = 'anime sleep'
break
case 'smoke': case 'fumar':
str = from === who ? `\`${from}\` está fumando! (￣ー￣)_旦~` : `\`${from}\` está fumando con \`${who}\`! (￣ー￣)_旦~`
query = 'anime smoke'
break
case 'spit': case 'escupir':
str = from === who ? `\`${from}\` se escupió a sí mismo/a! ٩(๑˘^˘๑)۶` : `\`${from}\` escupió a \`${who}\`! ٩(๑˘^˘๑)۶`
query = 'anime spit'
break
case 'step': case 'pisar':
str = from === who ? `\`${from}\` se pisó a sí mismo/a! ಥ_ಥ` : `\`${from}\` pisó a \`${who}\`! sin piedad`
query = 'anime step'
break
case 'think': case 'pensar':
str = from === who ? `\`${from}\` está pensando! (⸝⸝╸-╺⸝⸝)` : `\`${from}\` está pensando en \`${who}\`! (⸝⸝╸-╺⸝⸝)`
query = 'anime think'
break
case 'love': case 'enamorado': case 'enamorada':
str = from === who ? `\`${from}\` está enamorado/a de sí mismo/a! (≧◡≦) ♡` : `\`${from}\` está enamorado/a de \`${who}\`! (≧◡≦) ♡`
query = 'anime love'
break
case 'pat': case 'palmadita': case 'palmada':
str = from === who ? `\`${from}\` se da palmaditas de autoapoyo! ଘ(੭ˊᵕˋ)੭` : `\`${from}\` acaricia suavemente a \`${who}\`! ଘ(੭ˊᵕˋ)੭`
query = 'anime pat'
break
case 'poke': case 'picar':
str = from === who ? `\`${from}\` se da un toque curioso! (,,◕.◕,,)` : `\`${from}\` da un golpecito a \`${who}\`! (,,◕.◕,,)`
query = 'anime poke'
break
case 'pout': case 'pucheros':
str = from === who ? `\`${from}\` hace pucheros! (๑•́ ₃ •̀๑)` : `\`${from}\` está haciendo pucheros por \`${who}\`! (๑•́ ₃ •̀๑)`
query = 'anime pout'
break
case 'punch': case 'pegar': case 'golpear':
str = from === who ? `\`${from}\` se golpeó a sí mismo/a! (ദി˙ᗜ˙)` : `\`${from}\` golpea a \`${who}\`! con todas sus fuerzas (ദ്ദി˙ᗜ˙)`
query = 'anime punch'
break
case 'preg': case 'preñar': case 'embarazar':
str = from === who ? `\`${from}\` se embarazó solito/a... misterioso! (¬ω¬)` : `\`${from}\` le regaló 9 meses de espera a \`${who}\`! (¬ω¬)`
query = 'anime preg'
break
case 'run': case 'correr':
str = from === who ? `\`${from}\` está haciendo cardio... o eso dice! ┗(＾0＾)┓` : `\`${from}\` sale disparado/a al ver a \`${who}\` acercarse! ┗(＾0＾)┓`
query = 'anime run'
break
case 'sad': case 'triste':
str = from === who ? `\`${from}\` contempla la lluvia con expresión triste! (｡•́︿•̀｡)` : `\`${from}\` mira por la ventana y piensa en \`${who}\`! (｡•́︿•̀｡)`
query = 'anime sad'
break
case 'scared': case 'asustada': case 'asustado':
str = from === who ? `\`${from}\` se asusta! (꒪ཀ꒪)` : `\`${from}\` está aterrorizado/a de \`${who}\`! (꒪ཀ꒪)`
query = 'anime scared'
break
case 'seduce': case 'seducir':
str = from === who ? `\`${from}\` susurra versos de amor al aire! ( ͡° ͜ʖ ͡°)` : `\`${from}\` lanza una mirada que derrite a \`${who}\`! ( ͡° ͜ʖ ͡°)`
query = 'anime seduce'
break
case 'shy': case 'timido': case 'timida':
str = from === who ? `\`${from}\` no sabe cómo actuar... se pone rojo/a! (⸝⸝⸝-﹏-⸝⸝⸝)` : `\`${from}\` baja la mirada tímidamente frente a \`${who}\`! (⸝⸝⸝-﹏-⸝⸝⸝)`
query = 'anime shy'
break
case 'walk': case 'caminar':
str = from === who ? `\`${from}\` pasea! ┌( ಠ‿ಠ)┘` : `\`${from}\` está caminando con \`${who}\`! ┌( ಠ‿ಠ)┘`;
query = 'anime walk' 
break
case 'dramatic': case 'drama':
str = from === who ? `\`${from}\` está montando un show digno de un Oscar! (┬┬﹏┬┬)` : `\`${from}\` está actuando dramáticamente por \`${who}\`! (┬┬﹏┬┬)`
query = 'anime dramatic'
break
case 'kisscheek': case 'beso':
str = from === who ? `\`${from}\` se besó la mejilla con cariño! (˶ ˘ ³˘)` : `\`${from}\` besó la mejilla de \`${who}\` con ternura! (˶ ˘ ³˘)`
query = 'anime kisscheek'
break
case 'wink': case 'guiñar':
str = from === who ? `\`${from}\` se guiñó el ojo a sí mismo/a en el espejo! (⸝⸝> ᴗ•⸝⸝)` : `\`${from}\` le guiñó el ojo a \`${who}\`! (⸝⸝> ᴗ•⸝⸝)`
query = 'anime wink'
break
case 'cringe': case 'avergonzarse':
str = from === who ? `\`${from}\` siente cringe! (ᇂ_ᇂ|||)` : `\`${from}\` siente cringe por \`${who}\`! (ᇂ_ᇂ|||)`
query = 'anime cringe'
break
case 'smug': case 'presumir':
str = from === who ? `\`${from}\` está presumiendo mucho últimamente! ପ(๑•ᴗ•๑)ଓ` : `\`${from}\` está presumiendo a \`${who}\`! ପ(๑•ᴗ•๑)ଓ`
query = 'anime smug'
break
case 'smile': case 'sonreir':
str = from === who ? `\`${from}\` está sonriendo! ( ˶ˆᗜˆ˵ )` : `\`${from}\` le sonrió a \`${who}\`! ( ˶ˆᗜˆ˵ )`
query = 'anime smile'
break
case 'clap': case 'aplaudir':
str = from === who ? `\`${from}\` está aplaudiendo por algo! (୨୧•͈ᴗ•͈)` : `\`${from}\` está aplaudiendo por \`${who}\`! (୨୧•͈ᴗ•͈)`
query = 'anime clap'
break
case 'highfive': case '5':
str = from === who ? `\`${from}\` se chocó los cinco frente al espejo! (•̀o•́)ง` : `\`${from}\` chocó los 5 con \`${who}\`! (•̀o•́)ง٩(ˊᗜˋ)`
query = 'anime highfive'
break
case 'handhold': case 'mano':
str = from === who ? `\`${from}\` se dio la mano consigo mismo/a! (∩•̀ω•́)⊃` : `\`${from}\` le agarró la mano a \`${who}\`! (∩•̀ω•́)⊃`
query = 'anime handhold'
break
case 'bullying': case 'bully':
str = from === who ? `\`${from}\` se hace bullying solo… alguien abrácelo! ༼ ಠДಠ ༽` : `\`${from}\` le está haciendo bullying a \`${who}\`! ༼ ಠДಠ ༽`
query = 'anime bullying'
break
case 'wave': case 'hola': case 'ola':
str = from === who ? `\`${from}\` se saludó a sí mismo/a en el espejo! (๑˃̵ᴗ˂̵)و` : `\`${from}\` está saludando a \`${who}\`! (๑˃̵ᴗ˂̵)و`
query = 'anime wave'
break
}
if (m.isGroup) {
try {
const res = await fetch(`${global.APIs.delirius.url}/search/tenor?q=${query}`)
const json = await res.json()
const gifs = json.data
if (!gifs || gifs.length === 0) return m.reply('ꕥ No se encontraron resultados.')
const randomGif = gifs[Math.floor(Math.random() * gifs.length)].mp4
conn.sendMessage(m.chat, { video: { url: randomGif }, gifPlayback: true, caption: str, mentions: [who] }, { quoted: m })
} catch (e) {
return m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`)
}}}

handler.help = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.tags = ['anime']
handler.command = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.group = true

export default handler