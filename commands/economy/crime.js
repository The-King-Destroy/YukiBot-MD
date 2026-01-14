export default {
  command: ['crime', 'crimen'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix, command) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const monedas = global.db.data.settings[botId].currency
    if (chat.adminonly || !chat.economy) return m.reply(`ꕥ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    if (!user.lastcrime) user.lastcrime = 0
    const remainingTime = user.lastcrime - Date.now()
    if (remainingTime > 0) {
      return m.reply(`ꕥ Debes esperar *${msToTime(remainingTime)}* antes de intentar nuevamente.`)
    }
    const éxito = Math.random() < 0.4
    let cantidad
    if (éxito) {
      cantidad = Math.floor(Math.random() * (7500 - 5500 + 1)) + 5500
      user.coins += cantidad
    } else {
      cantidad = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000
      const total = user.coins + user.bank
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins -= cantidad
        } else {
          const restante = cantidad - user.coins
          user.coins = 0
          user.bank -= restante
        }
      } else {
        cantidad = total
        user.coins = 0
        user.bank = 0
      }
    }
    user.lastcrime = Date.now() + 7 * 60 * 1000
    const successMessages = [
      `Hackeaste un cajero automático usando un exploit del sistema y retiraste efectivo sin alertas, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Te infiltraste como técnico en una mansión y robaste joyas mientras inspeccionabas la red, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Simulaste una transferencia bancaria falsa y obtuviste fondos antes de que cancelaran la operación, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Interceptaste un paquete de lujo en una recepción corporativa y lo revendiste, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Vaciaste una cartera olvidada en un restaurante sin que nadie lo notara, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Accediste al servidor de una tienda digital y aplicaste descuentos fraudulentos para obtener productos gratis, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Te hiciste pasar por repartidor y sustrajiste un paquete de colección sin levantar sospechas, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Copiaste la llave maestra de una galería de arte y vendiste una escultura sin registro, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Creaste un sitio falso de caridad y lograste que cientos de personas donaran, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Manipulaste un lector de tarjetas en una tienda local y vaciaste cuentas privadas, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Falsificaste entradas VIP para un evento y accediste a un área con objetos exclusivos, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Engañaste a un coleccionista vendiéndole una réplica como pieza original, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Capturaste la contraseña de un empresario en un café y transferiste fondos a tu cuenta, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `Convenciste a un anciano de participar en una inversión falsa y retiraste sus ahorros, ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`
    ]
    const failMessages = [
      `Intentaste vender un reloj falso, pero el comprador notó el engaño y te denunció, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Hackeaste una cuenta bancaria, pero olvidaste ocultar tu IP y fuiste rastreado, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Robaste una mochila en un evento, pero una cámara oculta capturó todo el acto, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Te infiltraste en una tienda de lujo, pero el sistema silencioso activó la alarma, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Simulaste ser técnico en una mansión, pero el dueño te reconoció y llamó a seguridad, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Intentaste vender documentos secretos, pero eran falsos y nadie quiso comprarlos, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Planeaste un robo en una joyería, pero el guardia nocturno te descubrió, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Hackeaste un servidor corporativo, pero tu conexión se cayó y rastrearon tu ubicación, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Intentaste robar un coche de lujo, pero el GPS alertó a la policía, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Engañaste a un cliente con un contrato falso, pero lo revisó y te demandó, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Trataste de escapar con mercancía robada, pero tropezaste y te atraparon, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `Hackeaste una tarjeta de crédito, pero el banco bloqueó la transacción, perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`
    ]
    const message = éxito ? pickRandom(successMessages) : pickRandom(failMessages)
    await client.sendMessage(m.chat, { text: `「✿」 ${message}` }, { quoted: m })
  },
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const min = minutes < 10 ? '0' + minutes : minutes
  const sec = seconds < 10 ? '0' + seconds : seconds
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}