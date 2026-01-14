import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['topinactive','topinactivos','topinactiveusers'],
  category: 'rpg',
  run: async (client,m,args,command,text,prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    const now = new Date()

    let daysArg = args[0] ? parseInt(args[0]) : 30
    if (daysArg < 1) daysArg = 30
    const cutoff = new Date(now.getTime() - daysArg * 24 * 60 * 60 * 1000)

    const ranking = Object.entries(chatData.users || {})
      .map(([jid,user]) => {
        const stats = user.stats || {}
        const days = Object.entries(stats).filter(([date]) => new Date(date) >= cutoff)
        const totalMsgs = days.reduce((acc,[,d]) => acc + (d.msgs || 0),0)
        return { jid,totalMsgs }
      })
      .sort((a,b) => a.totalMsgs - b.totalMsgs)

    if (ranking.length === 0) return m.reply(`「✎」 No hay actividad registrada en los últimos ${daysArg} días.`)

    const page = parseInt(args[1]) || 1
    const perPage = 10
    const totalPages = Math.ceil(ranking.length / perPage)
    if (page < 1 || page > totalPages) return m.reply(`「✎」 Página inválida. Solo hay ${totalPages} páginas disponibles.`)

    const start = (page - 1) * perPage
    const end = start + perPage
    const pageRanking = ranking.slice(start,end)

    let report = `❀ Top de usuarios inactivos ❀\n`
    report += `> » Días: \`${daysArg}\`\n`
    report += `> » Página: \`${page}\` de \`${totalPages}\`\n\n`

    const mentions = []
    pageRanking.forEach((u,i) => {
      const name = db.users[u.jid]?.name || '@'+u.jid.split('@')[0]
      report += `*${start+i+1}.* ${name}\n`
      report += `   » Mensajes: \`${u.totalMsgs}\`\n`
      mentions.push(u.jid)
    })

    if (page < totalPages) {
      report += `\n> Para ver la siguiente página › *${prefix+command} ${daysArg} ${page+1}*`
    }

    await client.reply(chatId,report,m,{mentions})
  }
}