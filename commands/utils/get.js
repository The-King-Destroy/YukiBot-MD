import fetch from 'node-fetch'
import { format } from 'util'

export default {
  command: ['get', 'fetch'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args[0];
    if (!text) return m.reply('《✧》 Ingresa un enlace para realizar la solicitud.')
    if (!/^https?:\/\//.test(text)) {
      return m.reply('《✧》 Ingresa un enlace válido que comience con http o https');
    }
    try {
      const _url = new URL(text);
      const params = new URLSearchParams(_url.searchParams);
      const url = `${_url.origin}${_url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      const contentLength = parseInt(res.headers.get('content-length') || '0');

      if (contentLength > 100 * 1024 * 1024) {
        return m.reply(`《✧》 El archivo es demasiado grande.\nContent-Length: ${contentLength} bytes`);
      }
      if (/text|json/.test(contentType)) {
        const buffer = await res.buffer();
        try {
          const json = JSON.parse(buffer.toString());
          return m.reply(format(json).slice(0, 65536));
        } catch {
          return m.reply(buffer.toString().slice(0, 65536));
        }
      } else {
        const buffer = await res.buffer();
        return client.sendFile(m.chat, buffer, 'file', text, m);
      }
    } catch (e) {
      console.error(err);
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
};