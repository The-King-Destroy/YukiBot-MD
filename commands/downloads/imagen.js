import axios from 'axios'

export default {
  command: ['imagen', 'img', 'image'],
  category: 'search',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ')
    if (!text) {
      return client.reply(m.chat, `《✧》 Por favor, Ingrese un término de búsqueda.`, m)
    }
    const bannedWords = [
  '+18', '18+', 'contenido adulto', 'contenido explícito', 'contenido sexual',
  'actriz porno', 'actor porno', 'estrella porno', 'pornstar', 'video xxx', 'xxx', 'x x x',
  'pornhub', 'xvideos', 'xnxx', 'redtube', 'brazzers', 'onlyfans', 'cam4', 'chaturbate',
  'myfreecams', 'bongacams', 'livejasmin', 'spankbang', 'tnaflix', 'hclips', 'fapello',
  'mia khalifa', 'lana rhoades', 'riley reid', 'abella danger', 'brandi love',
  'eva elfie', 'nicole aniston', 'janice griffith', 'alexis texas', 'lela star',
  'gianna michaels', 'adriana chechik', 'asa akira', 'mandy muse', 'kendra lust',
  'jordi el niño polla', 'johnny sins', 'danny d', 'manuel ferrara', 'mark rockwell',
  'porno', 'porn', 'sexo', 'sex', 'desnudo', 'desnuda', 'erótico', 'erotico', 'erotika',
  'tetas', 'pechos', 'boobs', 'boob', 'nalgas', 'culo', 'culos', 'qlos', 'trasero',
  'pene', 'verga', 'vergota', 'pito', 'chocha', 'vagina', 'vaginas', 'coño', 'concha',
  'genital', 'genitales', 'masturbar', 'masturbación', 'masturbacion', 'gemidos',
  'gemir', 'orgía', 'orgy', 'trío', 'trio', 'gangbang', 'creampie', 'facial', 'cum',
  'milf', 'teen', 'incesto', 'incest', 'violación', 'violacion', 'rape', 'bdsm',
  'hentai', 'tentacle', 'tentáculos', 'fetish', 'fetiche', 'sado', 'sadomaso',
  'camgirl', 'camsex', 'camshow', 'playboy', 'playgirl', 'playmate', 'striptease',
  'striptis', 'slut', 'puta', 'putas', 'perra', 'perras', 'whore', 'fuck', 'fucking',
  'fucked', 'cock', 'dick', 'pussy', 'ass', 'shemale', 'trans', 'transgénero',
  'transgenero', 'lesbian', 'lesbiana', 'gay', 'lgbt', 'explicit', 'hardcore',
  'softcore', 'nudista', 'nudismo', 'nudity', 'deepthroat', 'dp', 'double penetration',
  'analplay', 'analplug', 'rimjob', 'spank', 'spanking', 'lick', 'licking', '69',
  'doggystyle', 'reverse cowgirl', 'cowgirl', 'blowjob', 'bj', 'handjob', 'hj',
  'p0rn', 's3x', 'v@gina', 'c0ck', 'd1ck', 'fuk', 'fuking', 'fak', 'boobz', 'pusy',
  'azz', 'cumshot', 'sexcam', 'livecam', 'webcam', 'sexchat', 'sexshow', 'sexvideo',
  'sexvid', 'sexpics', 'sexphoto', 'seximage', 'sexgif', 'pornpic', 'pornimage',
  'pornvid', 'pornvideo', 'only fan', 'only-fans', 'only_fans', 'onlyfans.com',
  'mia khalifha', 'mia khalifah', 'mia khalifaa', 'mia khalif4', 'mia khal1fa',
  'mia khalifa +18', 'mia khalifa xxx', 'mia khalifa desnuda', 'mia khalifa porno'
  ]
    const lowerText = text.toLowerCase()
    const nsfwEnabled = global.db.data.chats[m.chat]?.nsfw === true
    if (!nsfwEnabled && bannedWords.some(word => lowerText.includes(word))) {
      return m.reply('《✧》 Este comando no *permite* búsquedas de contenido *+18* o *NSFW*')
    }
    try {
      const results = await getImageSearchResults(text)
      const checked = []
      for (const r of results) {
        if (r.url && r.url.startsWith('http') && /\.(jpe?g|png|gif|webp)$/i.test(r.url)) {
          if (await isImageUrl(r.url)) {
            checked.push(r)
          }
        }
      }
      if (checked.length < 2) { 
      return client.reply(m.chat, `《✧》 Se requieren al menos 2 imágenes válidas para mostrar un álbum.`, m)
      }
      const medias = checked.slice(0, 10).map(r => ({ type: 'image', data: { url: r.url }, caption: `ㅤ۟∩　ׅ　★　ׅ　🅖oogle 🅘mage 🅢earch　ׄᰙ　\n\n` + `${r.title ? `𖣣ֶㅤ֯⌗ ☆  ⬭ *Título* › ${r.title}\n` : ''}` + `${r.domain ? `𖣣ֶㅤ֯⌗ ☆  ⬭ *Fuente* › ${r.domain}\n` : ''}` + `${r.resolution ? `𖣣ֶㅤ֯⌗ ☆  ⬭ *Resolución* › ${r.resolution}\n` : ''}` + `𖣣ֶㅤ֯⌗ ☆  ⬭ *Búsqueda* › ${text}` }))
      await client.sendAlbumMessage(m.chat, medias, { quoted: m })
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}

async function getImageSearchResults(query) {
  const endpoints = [
    { url: `${global.APIs.stellar.url}/search/googleimagen?query=${encodeURIComponent(query)}&key=${global.APIs.stellar.key}`, extractor: res => res.data?.map(d => ({ url: d.url, title: d.title || null, domain: d.domain || null, resolution: d.width && d.height ? `${d.width}x${d.height}` : null })) || [] },
    { url: `${global.APIs.siputzx.url}/api/images?query=${encodeURIComponent(query)}`, extractor: res => res.data?.map(d => ({ url: d.url, title: null, domain: null, resolution: d.width && d.height ? `${d.width}x${d.height}` : null })) || [] },
    { url: `${global.APIs.delirius.url}/search/gimage?query=${encodeURIComponent(query)}`, extractor: res => res.data?.map(d => ({ url: d.url, title: d.origin?.title || null, domain: d.origin?.website?.domain || null, resolution: d.width && d.height ? `${d.width}x${d.height}` : null })) || [] },
    { url: `${global.APIs.apifaa.url}/faa/google-image?query=${encodeURIComponent(query)}`, extractor: res => res.result?.map(u => ({ url: u, title: null, domain: null, resolution: null })) || [] }
  ]
  
  for (const { url, extractor } of endpoints) {
    try {
      const res = await axios.get(url)
      const results = extractor(res.data)
      if (results?.length) return results
    } catch {}
  }
  return []
}

async function isImageUrl(url) {
  try {
    const res = await axios.head(url, { timeout: 1000 })
    return res.headers['content-type']?.startsWith('image/')
  } catch {
    return false
  }
}