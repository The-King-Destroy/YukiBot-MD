import fetch from 'node-fetch'

const regex = /^(?:https:\/\/|git@)github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/i

export default {
  command: ['gitclone', 'git'],
  category: 'github',
  run: async (client, m, args, usedPrefix, command, text) => {
    if (!text) return client.reply(m.chat, '《✧》 Por favor, proporciona un enlace o nombre del repositorio de GitHub.', m)
    try {
      await m.react('🕒')
      let info = ''
      let image
      let zipBuffer, zipName
      let repos = []
      const match = text.match(regex)
      if (match) {
        const [, user, repo] = match
        const repoRes = await fetch(`https://api.github.com/repos/${user}/${repo}`)
        const zipRes = await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`)
        const repoData = await repoRes.json()
        zipName = zipRes.headers.get('content-disposition')?.match(/filename=(.*)/)?.[1]
        if (!zipName) zipName = `${repo}-${user}.zip`
        zipBuffer = Buffer.from(await zipRes.arrayBuffer())
        repos.push(repoData)
        image = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745610598914.jpeg'
      } else {
        const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`)
        const json = await res.json()
        if (!json.items.length) return client.reply(m.chat, '《✧》 No se encontraron resultados.', m)
        if (json.items.length === 1) {
          const repo = json.items[0]
          const zipRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/zipball`)
          zipName = zipRes.headers.get('content-disposition')?.match(/filename=(.*)/)?.[1]
          if (!zipName) zipName = `${repo.name}-${repo.owner.login}.zip`
          zipBuffer = Buffer.from(await zipRes.arrayBuffer())
          repos.push(repo)
          image = Buffer.from(await (await fetch(repo.owner.avatar_url)).arrayBuffer())
        } else {
          repos = json.items
          image = Buffer.from(await (await fetch(repos[0].owner.avatar_url)).arrayBuffer())
        }
      }
      info += repos.map((repo, index) => `✩ Resultado: ${index + 1}
✩ Creador: ${repo.owner.login}
✩ Nombre: ${repo.name}
✩ Creado: ${formatDate(repo.created_at)}
✩ Actualizado: ${formatDate(repo.updated_at)}
✩ Visitas: ${repo.watchers}
✩ Bifurcado: ${repo.forks}
✩ Estrellas: ${repo.stargazers_count}
✩ Issues: ${repo.open_issues}
✩ Descripción: ${repo.description ? repo.description : 'Sin Descripción'}
✩ Enlace: ${repo.clone_url}`).join('\n────────────────────\n')
      await client.sendFile(m.chat, image, 'github_info.jpg', info.trim(), m)
      if (zipBuffer && zipName) {
        await client.sendFile(m.chat, zipBuffer, zipName, null, m)
      }
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}

function formatDate(n, locale = 'es') {
  const d = new Date(n)
  return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
}