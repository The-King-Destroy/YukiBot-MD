import fetch from 'node-fetch';
import { resolveLidToRealJid } from "../../lib/utils.js"

const captions = {
  peek: (from, to, genero) => from === to ? 'está espiando detrás de una puerta por diversión.' : `está espiando a`,
  comfort: (from, to) => (from === to ? 'se está consolando a sí mismo.' : 'está consolando a'),
  thinkhard: (from, to) => from === to ? 'se quedó pensando muy intensamente.' : 'está pensando profundamente en',
  curious: (from, to) => from === to ? 'se muestra curioso por todo.' : 'está curioso por lo que hace',
  sniff: (from, to) => from === to ? 'se olfatea como si buscara algo raro.' : 'está olfateando a',
  stare: (from, to) => from === to ? 'se queda mirando al techo sin razón.' : 'se queda mirando fijamente a',
  trip: (from, to) => from === to ? 'se tropezó consigo mismo, otra vez.' : 'tropezó accidentalmente con',
  blowkiss: (from, to) => (from === to ? 'se manda un beso al espejo.' : 'le lanzó un beso a'),
  snuggle: (from, to) => from === to ? 'se acurruca con una almohada suave.' : 'se acurruca dulcemente con',
  sleep: (from, to, genero) => from === to ? 'está durmiendo plácidamente.' : 'está durmiendo con',
  cold: (from, to, genero) => (from === to ? 'tiene mucho frío.' : 'se congela por el frío de'),
  sing: (from, to, genero) => (from === to ? 'está cantando.' : 'le está cantando a'),
  tickle: (from, to, genero) => from === to ? 'se está haciendo cosquillas.' : 'le está haciendo cosquillas a',
  scream: (from, to, genero) => (from === to ? 'está gritando al viento.' : 'le está gritando a'),
  push: (from, to, genero) => (from === to ? 'se empujó a sí mismo.' : 'empujó a'),
  nope: (from, to, genero) => (from === to ? 'expresa claramente su desacuerdo.' : 'dice “¡No!” a'),
  jump: (from, to, genero) => (from === to ? 'salta de felicidad.' : 'salta feliz con'),
  heat: (from, to, genero) => (from === to ? 'siente mucho calor.' : 'tiene calor por'),
  gaming: (from, to, genero) => (from === to ? 'está jugando solo.' : 'está jugando con'),
  draw: (from, to, genero) => (from === to ? 'hace un lindo dibujo.' : 'dibuja inspirado en'),
  call: (from, to, genero) => from === to ? 'marca su propio número esperando respuesta.' : 'llamó al número de',
  seduce: (from, to, genero) => from === to ? 'lanzó una mirada seductora al vacío.' : 'está intentando seducir a',
  shy: (from, to, genero) => from === to ? `se sonrojó tímidamente y desvió la mirada.` : `se siente demasiado ${genero === 'Hombre' ? 'tímido' : genero === 'Mujer' ? 'tímida' : 'tímide'} para mirar a`,
  slap: (from, to, genero) => from === to ? `se dio una bofetada a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio una bofetada a',
  bath: (from, to) => (from === to ? 'se está bañando.' : 'está bañando a'),
  angry: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'}.` : `está super ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'} con`,
  bored: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'}.` : `está ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'} de`,
  bite: (from, to, genero) => from === to ? `se mordió ${genero === 'Hombre' ? 'solito' : genero === 'Mujer' ? 'solita' : 'solitx'}.` : 'mordió a',
  bleh: (from, to) => from === to ? 'se sacó la lengua frente al espejo.' : 'le está haciendo muecas con la lengua a',
  bonk: (from, to, genero) => from === to ? `se dio un bonk a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio un golpe a',
  blush: (from, to) => (from === to ? 'se sonrojó.' : 'se sonrojó por'),
  impregnate: (from, to) => (from === to ? 'se embarazó.' : 'embarazó a'),
  bully: (from, to, genero) => from === to ? `se hace bullying ${genero === 'Hombre' ? 'el mismo' : genero === 'Mujer' ? 'ella misma' : 'el/ella mismx'}… alguien ${genero === 'Hombre' ? 'que lo abrace' : genero === 'Mujer' ? 'que la abrace' : `que ${genero === 'Hombre' ? 'lo' : genero === 'Mujer' ? 'la' : 'lx'} ayude`}.` : 'le está haciendo bullying a',
  cry: (from, to) => (from === to ? 'está llorando.' : 'está llorando por'),
  happy: (from, to) => (from === to ? 'está feliz.' : 'está feliz con'),
  coffee: (from, to) => (from === to ? 'está tomando café.' : 'está tomando café con'),
  clap: (from, to) => (from === to ? 'está aplaudiendo por algo.' : 'está aplaudiendo por'),
  cringe: (from, to) => (from === to ? 'siente cringe.' : 'siente cringe por'),
  dance: (from, to) => (from === to ? 'está bailando.' : 'está bailando con'),
  cuddle: (from, to, genero) => from === to ? `se acurrucó ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'se acurrucó con',
  drunk: (from, to, genero) => from === to ? `está demasiado ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'}` : `está ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'} con`,
  dramatic: (from, to) => from === to ? 'está haciendo un drama exagerado.' : 'le está haciendo un drama a',
  handhold: (from, to, genero) => from === to ? `se dio la mano consigo ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le agarró la mano a',
  eat: (from, to) => (from === to ? 'está comiendo algo delicioso.' : 'está comiendo con'),
  highfive: (from, to) => from === to ? 'se chocó los cinco frente al espejo.' : 'chocó los 5 con',
  hug: (from, to, genero) => from === to ? `se abrazó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio un abrazo a',
  kill: (from, to) => (from === to ? 'se autoeliminó en modo dramático.' : 'asesinó a'),
  kiss: (from, to) => (from === to ? 'se mandó un beso al aire.' : 'le dio un beso a'),
  kisscheek: (from, to) => from === to ? 'se besó en la mejilla usando un espejo.' : 'le dio un beso en la mejilla a',
  lick: (from, to) => (from === to ? 'se lamió por curiosidad.' : 'lamió a'),
  laugh: (from, to) => (from === to ? 'se está riendo de algo.' : 'se está burlando de'),
  pat: (from, to) => (from === to ? 'se acarició la cabeza con ternura.' : 'le dio una caricia a'),
  love: (from, to, genero) => from === to ? `se quiere mucho a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'siente atracción por',
  pout: (from, to, genero) => from === to ? `está haciendo pucheros ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'está haciendo pucheros con',
  punch: (from, to) => (from === to ? 'lanzó un puñetazo al aire.' : 'le dio un puñetazo a'),
  run: (from, to) => (from === to ? 'está corriendo por su vida.' : 'está corriendo con'),
  scared: (from, to, genero) => from === to ? `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por algo.` : `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por`,
  sad: (from, to) => (from === to ? `está triste` : `está expresando su tristeza a`),
  smoke: (from, to) => (from === to ? 'está fumando tranquilamente.' : 'está fumando con'),
  smile: (from, to) => (from === to ? 'está sonriendo.' : 'le sonrió a'),
  spit: (from, to, genero) => from === to ? `se escupió a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} por accidente.` : 'le escupió a',
  smug: (from, to) => (from === to ? 'está presumiendo mucho últimamente.' : 'está presumiendo a'),
  think: (from, to) => from === to ? 'está pensando profundamente.' : 'no puede dejar de pensar en',
  step: (from, to, genero) => from === to ? `se pisó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} por accidente.` : 'está pisando a',
  wave: (from, to, genero) => from === to ? `se saludó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'está saludando a',
  walk: (from, to) => (from === to ? 'salió a caminar en soledad.' : 'decidió dar un paseo con'),
  wink: (from, to, genero) => from === to ? `se guiñó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'le guiñó a',
  psycho: (from, to) => from === to ? 'está actuando como un psicópata.' : 'está teniendo un ataque de locura por',
  poke: (from, to) => from === to ? 'se picó a sí mismo.' : 'le da un golpecito a',
  cook: (from, to) => from === to ? 'está concentrado en la cocina.' : 'se divierte cocinando con',
  lewd: (from, to) => from === to ? 'se comporta de forma provocativa.' : 'se mueve de manera seductora por',
  greet: (from, to) => from === to ? 'extiende la mano para saludar a todos.' : 'extiende la mano para saludar a',
  facepalm: (from, to) => from === to ? 'se frustra y se da una palmada en la cara.' : 'se da una palmada en la cara por',
}

const symbols = ['(⁠◠⁠‿⁠◕⁠)', '˃͈◡˂͈', '૮(˶ᵔᵕᵔ˶)ა', '(づ｡◕‿‿◕｡)づ', '(✿◡‿◡)', '(꒪⌓꒪)', '(✿✪‿✪｡)', '(*≧ω≦)', '(✧ω◕)', '˃ 𖥦 ˂', '(⌒‿⌒)', '(¬‿¬)', '(✧ω✧)', '✿(◕ ‿◕)✿', 'ʕ•́ᴥ•̀ʔっ', '(ㅇㅅㅇ❀)', '(∩︵∩)', '(✪ω✪)', '(✯◕‿◕✯)', '(•̀ᴗ•́)و ̑̑']
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const alias = {
  psycho: ['psycho', 'locura'],
  poke: ['poke', 'picar'],
  cook: ['cook', 'cocinar'],
  lewd: ['lewd', 'provocativo', 'provocativa'],
  greet: ['greet', 'saludar', 'hola', 'hi'],
  facepalm: ['facepalm', 'palmada', 'frustracion'],
  angry: ['angry','enojado','enojada'],
  bleh: ['bleh'],
  bored: ['bored','aburrido','aburrida'],
  clap: ['clap','aplaudir'],
  coffee: ['coffee','cafe'],
  dramatic: ['dramatic','drama'],
  drunk: ['drunk'],
  cold: ['cold'],
  impregnate: ['impregnate','preg','preñar','embarazar'],
  kisscheek: ['kisscheek','beso','besar'],
  laugh: ['laugh'],
  love: ['love','amor'],
  pout: ['pout','mueca'],
  punch: ['punch','golpear'],
  run: ['run','correr'],
  sad: ['sad','triste'],
  scared: ['scared','asustado'],
  seduce: ['seduce','seducir'],
  shy: ['shy','timido','timida'],
  sleep: ['sleep','dormir'],
  smoke: ['smoke','fumar'],
  spit: ['spit','escupir'],
  step: ['step','pisar'],
  think: ['think','pensar'],
  walk: ['walk','caminar'],
  hug: ['hug','abrazar'],
  kill: ['kill','matar'],
  eat: ['eat','nom','comer'],
  kiss: ['kiss','muak','besar'],
  wink: ['wink','guiñar'],
  pat: ['pat','acariciar'],
  happy: ['happy','feliz'],
  bully: ['bully','molestar'],
  bite: ['bite','morder'],
  blush: ['blush','sonrojarse'],
  wave: ['wave','saludar'],
  bath: ['bath','bañarse'],
  smug: ['smug','presumir'],
  smile: ['smile','sonreir'],
  highfive: ['highfive','choca'],
  handhold: ['handhold','tomar'],
  cringe: ['cringe','mueca'],
  bonk: ['bonk','golpe'],
  cry: ['cry','llorar'],
  lick: ['lick','lamer'],
  slap: ['slap','bofetada'],
  dance: ['dance','bailar'],
  cuddle: ['cuddle','acurrucar'],
  sing: ['sing','cantar'],
  tickle: ['tickle','cosquillas'],
  scream: ['scream','gritar'],
  push: ['push','empujar'],
  nope: ['nope','no'],
  jump: ['jump','saltar'],
  heat: ['heat','calor'],
  gaming: ['gaming','jugar'],
  draw: ['draw','dibujar'],
  call: ['call','llamar'],
  snuggle: ['snuggle','acurrucarse'],
  blowkiss: ['blowkiss','besito'],
  trip: ['trip','tropezar'],
  stare: ['stare','mirar'],
  sniff: ['sniff','oler'],
  curious: ['curious','curioso','curiosa'],
  thinkhard: ['thinkhard','pensar'],
  comfort: ['comfort','consolar'],
  peek: ['peek','mirar']
};

export default {
command: ['angry','enojado','enojada','bleh','bored','aburrido','aburrida','clap','aplaudir','coffee','cafe','dramatic','drama','drunk','cold','impregnate','preg','preñar','embarazar','kisscheek','beso','besar','laugh','love','amor','pout','mueca','punch','golpear','run','correr','sad','triste','scared','asustado','seduce','seducir','shy','timido','timida','sleep','dormir','smoke','fumar','spit','escupir','step','pisar','think','pensar','walk','caminar','hug','abrazar','kill','matar','eat','nom','comer','kiss','muak','wink','guiñar','pat','acariciar','happy','feliz','bully','molestar','bite','morder','blush','sonrojarse','wave','saludar','bath','bañarse','smug','presumir','smile','sonreir','highfive','choca','handhold','tomar','cringe','mueca','bonk','golpe','cry','llorar','lick','lamer','slap','bofetada','dance','bailar','cuddle','acurrucar','sing','cantar','tickle','cosquillas','scream','gritar','push','empujar','nope','no','jump','saltar','heat','calor','gaming','jugar','draw','dibujar','call','llamar','snuggle','acurrucarse','blowkiss','besito','trip','tropezar','stare','mirar','sniff','oler','curious','curioso','curiosa','thinkhard','pensar','comfort','consolar','peek','mirar','psycho','locura','poke','picar','cook','cocinar','lewd','provocativo','provocativa','greet','saludar','hola','hi','facepalm','palmada','frustracion'],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    const currentCommand = Object.keys(alias).find(key => alias[key].includes(command)) || command
    if (!captions[currentCommand]) return
    let mentionedJid = m.mentionedJid
    let who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)
    const fromName = global.db.data.users[m.sender]?.name || '@'+m.sender.split('@')[0]
    const toName = global.db.data.users[who]?.name || '@'+who.split('@')[0]
    const genero = global.db.data.users[m.sender]?.genre || 'Oculto'
    const captionText = captions[currentCommand](fromName, toName, genero)
    const caption = who !== m.sender ? `\`${fromName}.\` ${captionText} \`${toName}.\` ${getRandomSymbol()}.` : `\`${fromName}\` ${captionText} ${getRandomSymbol()}.`
    try {
      const response = await fetch(`${global.APIs.stellar.url}/sfw/interaction?type=${currentCommand}&key=${global.APIs.stellar.key}`)
    const json = await response.json()
    let url = json?.result
    if (!url) {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=anime+${encodeURIComponent(currentCommand)}&key=AIzaSyCY8VRFGjKZ2wpAoRTQ3faV_XcwTrYL5DA&limit=20`)
    const jsonTenor = await res.json()
    const gifs = jsonTenor.results
    if (!gifs || gifs.length === 0) throw new Error('No se encontraron resultados en ninguna API.')
    const media = gifs[Math.floor(Math.random() * gifs.length)].media_formats
    url = media.mp4?.url || media.tinymp4?.url || media.loopedmp4?.url || media.gif?.url || media.tinygif?.url
    if (!url) throw new Error('No se encontró un formato compatible en Tenor.')
    }
      await client.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: [who, m.sender] }, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};