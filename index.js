import "./settings.js"
import main from './main.js'
import events from './commands/events.js'
import { Browsers, makeWASocket, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, jidDecode, DisconnectReason, jidNormalizedUser, } from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import readline from "readline";
import os from "os";
import { smsg } from "./lib/message.js";
import db from "./lib/system/database.js";
import { startSubBot } from './lib/subs.js';
import { exec, execSync } from "child_process";

const log = {
  info: (msg) => console.log(chalk.bgBlue.white.bold(`INFO`), chalk.white(msg)),
  success: (msg) =>
    console.log(chalk.bgGreen.white.bold(`SUCCESS`), chalk.greenBright(msg)),
  warn: (msg) =>
    console.log(
      chalk.bgYellowBright.blueBright.bold(`WARNING`),
      chalk.yellow(msg),
    ),
  warning: (msg) =>
    console.log(chalk.bgYellowBright.red.bold(`WARNING`), chalk.yellow(msg)),
  error: (msg) =>
    console.log(chalk.bgRed.white.bold(`ERROR`), chalk.redBright(msg)),
};

  let phoneNumber = global.botNumber || ""
  let phoneInput = ""
  const methodCodeQR = process.argv.includes("--qr")
  const methodCode = !!phoneNumber || process.argv.includes("--code")
  const DIGITS = (s = "") => String(s).replace(/\D/g, "");

  function normalizePhoneForPairing(input) {
    let s = DIGITS(input);
    if (!s) return "";
    if (s.startsWith("0")) s = s.replace(/^0+/, "");
    if (s.length === 10 && s.startsWith("3")) {
      s = "57" + s;
    }
    if (s.startsWith("52") && !s.startsWith("521") && s.length >= 12) {
      s = "521" + s.slice(2);
    }
    if (s.startsWith("54") && !s.startsWith("549") && s.length >= 11) {
      s = "549" + s.slice(2);
    }
    return s;
  }
  
const { say } = cfonts
console.log(chalk.magentaBright('\n❀ Iniciando...'))
  say('Yuki Suou', {
  align: 'center',           
  gradient: ['red', 'blue'] 
})
  say('Made with love by Destroy', {
  font: 'console',
  align: 'center',
  gradient: ['blue', 'magenta']
})

const BOT_TYPES = [
  { name: 'SubBot', folder: './Sessions/Subs', starter: startSubBot }
]

global.conns = global.conns || []
const reconnecting = new Set()

async function loadBots() {
  for (const { name, folder, starter } of BOT_TYPES) {
    if (!fs.existsSync(folder)) continue
    const botIds = fs.readdirSync(folder)
    for (const userId of botIds) {
      const sessionPath = path.join(folder, userId)
      const credsPath = path.join(sessionPath, 'creds.json')
      if (!fs.existsSync(credsPath)) continue
      if (global.conns.some((conn) => conn.userId === userId)) continue
      if (reconnecting.has(userId)) continue
      try {
        reconnecting.add(userId)
        await starter(null, null, 'Auto reconexión', false, userId, sessionPath)
      } catch (e) {
        reconnecting.delete(userId)
      }
      await new Promise((res) => setTimeout(res, 2500))
    }
  }
  setTimeout(loadBots, 60 * 1000)
}

(async () => {
  await loadBots()
})()

let opcion
if (methodCodeQR) {
  opcion = "1"
} else if (methodCode) {
  opcion = "2"
} else if (!fs.existsSync("./Sessions/Owner/creds.json")) {
  do {
    opcion = readlineSync.question(chalk.bold.white("\nSeleccione una opción:\n") + chalk.blueBright("1. Con código QR\n") + chalk.cyan("2. Con código de texto de 8 dígitos\n--> "))
    if (opcion === "2") {
      console.log(chalk.bold.redBright(`\nPor favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright("Ejemplo: +57301******")}\n${chalk.bold.magentaBright('---> ')} `))
      phoneInput = readlineSync.question("")
      phoneNumber = normalizePhoneForPairing(phoneInput)
    }
  } while (opcion !== "1" && opcion !== "2")
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const logger = pino({ level: "silent" })
  console.info = () => {}
  console.debug = () => {}
  const clientt = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    getMessage: async () => "",
    keepAliveIntervalMs: 45000,
    maxIdleTimeMs: 60000,
  })
  
  global.client = clientt;
  client.isInit = false
  client.ev.on("creds.update", saveCreds)
  if (opcion === "2" && !fs.existsSync("./Sessions/Owner/creds.json")) {
  setTimeout(async () => {
    try {
       if (!state.creds.registered) {
        const pairing = await global.client.requestPairingCode(phoneNumber)
        const codeBot = pairing?.match(/.{1,4}/g)?.join("-") || pairing
        console.log(chalk.bold.white(chalk.bgMagenta(`Código de emparejamiento:`)), chalk.bold.white(chalk.white(codeBot)))
      }
    } catch (err) {
      console.log(chalk.red("Error al generar código:"), err)
    }
  }, 3000)
}

  client.sendText = (jid, text, quoted = "", options) =>
  client.sendMessage(jid, { text: text, ...options }, { quoted })
  client.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications, } = update
    if (qr && opcion === "1" && !state.creds.registered) {
      console.log(chalk.green.bold("[ ✿ ] Escanea este código QR"))
      qrcode.generate(qr, { small: true })
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode || 0;
      if (reason === DisconnectReason.connectionLost) {
        log.warning("Se perdió la conexión al servidor, intento reconectarme..")
        startBot()
      } else if (reason === DisconnectReason.connectionClosed) {
        log.warning("Conexión cerrada, intentando reconectarse...")
        startBot()
      } else if (reason === DisconnectReason.restartRequired) {
        log.warning("Es necesario reiniciar..")
        startBot();
      } else if (reason === DisconnectReason.timedOut) {
        log.warning("Tiempo de conexión agotado, intentando reconectarse...")
        startBot()
      } else if (reason === DisconnectReason.badSession) {
        log.warning("Eliminar sesión y escanear nuevamente...")
        startBot()
      } else if (reason === DisconnectReason.connectionReplaced) {
        log.warning("Primero cierre la sesión actual...")
      } else if (reason === DisconnectReason.loggedOut) {
        log.warning("Escanee nuevamente y ejecute...")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(1)
      } else if (reason === DisconnectReason.forbidden) {
        log.error("Error de conexión, escanee nuevamente y ejecute...")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(1);
      } else if (reason === DisconnectReason.multideviceMismatch) {
        log.warning("Inicia nuevamente")
        exec("rm -rf ./Sessions/Owner/*")
        process.exit(0)
      } else {
        client.end(`Motivo de desconexión desconocido : ${reason}|${connection}`)
      }
    }
    if (connection == "open") {
         const userJid = jidNormalizedUser(client.user.id)
         const userName = client.user.name || "Desconocido"
         console.log(chalk.green.bold(`[ ✿ ]  Conectado a: ${userName}`))
    }
    if (isNewLogin) {
      log.info("Nuevo dispositivo detectado")
    }
    if (receivedPendingNotifications == "true") {
      log.warn("Por favor espere aproximadamente 1 minuto...")
      client.ev.flush()
    }
  });

  let m
  client.ev.on("messages.upsert", async ({ messages }) => {
    try {
      m = messages[0]
      if (!m.message) return
      m.message = Object.keys(m.message)[0] === "ephemeralMessage" ? m.message.ephemeralMessage.message : m.message
      if (m.key && m.key.remoteJid === "status@broadcast") return
      if (!client.public && !m.key.fromMe && messages.type === "notify") return
      if (m.key.id.startsWith("BAE5") && m.key.id.length === 16) return
      m = await smsg(client, m)
      main(client, m, messages)
    } catch (err) {
      console.log(err)
    }
  })
  try {
  await events(client, m)
  } catch (err) {
   console.log(chalk.gray(`[ BOT  ]  → ${err}`))
  }
  client.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid)
    } else return jid
  }
}

(async () => {
    global.loadDatabase()
    console.log(chalk.gray('[ ✿  ]  Base de datos cargada correctamente.'))
  await startBot()
})()