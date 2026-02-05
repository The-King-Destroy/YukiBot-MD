import fetch from 'node-fetch';
import FormData from 'form-data';

export default {
  command: ['seticon', 'setboticon'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return m.reply(mess.socket)
    const value = args.join(' ').trim()
    if (!value && !m.quoted && !m.message.imageMessage)
      return m.reply('✎ Debes enviar o citar una imagen para cambiar el icon del bot.')
    if (value.startsWith('http')) {
      config.icon = value
      return m.reply(`✿ Se ha actualizado el icon de *${config.namebot}*!`)
    }
    const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image\/(png|jpe?g)/.test(mime))
      return m.reply('✎ Responde a una imagen válida.')
    const buffer = await q.download()
    if (!buffer) return m.reply('✎ No se pudo descargar la imagen.')
    const url = await uploadImage(buffer, mime)
    config.icon = url
    return m.reply(`✿ Se ha actualizado el icon de *${config.namebot}*!`)
  },
};

async function uploadImage(buffer, mime) {
  const body = new FormData()
  body.append('files[]', buffer, `file.${mime.split('/')[1]}`)
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body, headers: body.getHeaders() })
  const json = await res.json()
  return json.files?.[0]?.url
}