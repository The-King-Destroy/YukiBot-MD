import {
  Browsers,
  makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  jidDecode,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import pino from "pino";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import express from 'express';
import { fileURLToPath } from 'url';
import NodeCache from 'node-cache';
import { startSubBot } from '../subs.js';
import cors from 'cors';
import bodyParser from 'body-parser';

if (!global.conns) global.conns = [];
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const groupCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });
let reintentos = {};

const cleanJid = (jid = '') => jid.replace(/:\d+/, '').split('@')[0];

export default async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const logger = express();
  const PORT = process.env.PORT || 5010;

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

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  logger.use(express.json());
  logger.use(express.static('public'))
  logger.use(cors())
  logger.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))
  logger.use(express.urlencoded({ extended: true }))

  logger.get('/', (req, res) => {
res.redirect('/home')})

logger.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

  const sockets = new Map();
  const sessions = new Map();

  async function startSocketIfNeeded(phone) {
    if (sockets.has(phone)) return sockets.get(phone);

        const pho = normalizePhoneForPairing(phone)

        const dir = path.join(__dirname, '../../Sessions/',  
      'Subs', pho
    );

    fs.mkdirSync(dir, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();

    const s = makeWASocket({
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('Chrome'),
      auth: state,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      getMessage: async () => '',
      msgRetryCounterCache,
      userDevicesCache,
      cachedGroupMetadata: async (jid) => groupCache.get(jid),
      version,
      keepAliveIntervalMs: 60000,
      maxIdleTimeMs: 120000,
    });

    s.isInit = false;
    s.ev.on('creds.update', saveCreds);
    s.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
      } else return jid;
    };

    s.ev.on('connection.update', async ({ connection, lastDisconnect, isNewLogin, qr }) => {
      if (isNewLogin) s.isInit = false;

      if (connection === 'open') {
        s.isInit = true;
        s.uptime = Date.now();
        s.userId = cleanJid(s.user?.id?.split('@')[0]);

        if (!global.conns.find((c) => c.userId === s.userId)) {
          global.conns.push(s);
        }

        delete reintentos[s.userId || phone];
      }

      if (connection === 'close') {
        const botId = s.userId || phone;
        const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason || 0;
        const intentos = reintentos[botId] || 0;
        reintentos[botId] = intentos + 1;

        if ([401, 403].includes(reason)) {
          if (intentos < 5) {
            console.log(chalk.gray(`[ ✿  ]  ${botId} Conexión cerrada (código ${reason}) intento ${intentos}/5 → Reintentando...`));
            setTimeout(() => {
            startSubBot(null, null, 'Auto reinicio', false, pho, null);
            }, 3000);
          } else {
            console.log(chalk.gray(`[ ✿  ]  ${botId} Falló tras 5 intentos. Eliminando sesión.`));
            try {
              fs.rmSync(path.join(basePath, 'Subs', pho), { recursive: true, force: true });
            } catch (e) {
              console.error(`[ ✿  ] No se pudo eliminar la carpeta`, e);
            }
            delete reintentos[botId];
          }
          return;
        }

        if ([DisconnectReason.connectionClosed, DisconnectReason.connectionLost, DisconnectReason.timedOut, DisconnectReason.connectionReplaced].includes(reason)) {
          setTimeout(() => {
           startSubBot(null, null, 'Auto reinicio', false, pho, null);
          }, 3000);
          return;
        }

        setTimeout(() => {
        startSubBot(null, null, 'Auto reinicio', false, pho, null);
        }, 3000);
      }
    });
    return s;
  }

async function getStatus(phone) {
  const normalizedPhone = normalizePhoneForPairing(phone);
  const sessionDirectories = ['Subs'];

  const exists = sessionDirectories.some(dir => {
    const dirPath = path.join(process.cwd(), 'Sessions', dir, normalizedPhone, 'creds.json');
   // const dirPath = path.join(__dirname, 'Sessions', dir, normalizedPhone, 'creds.json');
    return fs.existsSync(dirPath);
  });

  return {    
    connected: exists,
    number: exists ? normalizedPhone : ""
  };
}

  async function requestPairingCode(rawPhone) {
    const phoneDigits = normalizePhoneForPairing(rawPhone);
    if (!phoneDigits) throw new Error("Número inválido. Usa solo dígitos con código de país.");
    const s = await startSocketIfNeeded(phoneDigits);
    if (s.user) {
      const jid = s.user.id || "";
      const num = DIGITS(jid.split("@")[0]);
      const session = sessions.get(phoneDigits) || {};
      session.connectedNumber = num;
      session.detect = true;
      sessions.set(phoneDigits, session);
      return null;
    }
    await sleep(1500);
    const code = await s.requestPairingCode(phoneDigits, 'STBOTMD1');
    const pretty = String(code).match(/.{1,4}/g)?.join("-") || code;
    return pretty;
  }

  async function startPairing(rawPhone) {
    const phone = normalizePhoneForPairing(rawPhone);
    const st = await getStatus(phone);
    const numbot = st.number + "@s.whatsapp.net";
    if (!numbot) return { ok: false, message: 'Número inválido o no conectado.' };
    if (st.connected) {
      return {
        ok: true,
        connected: true,
        number: numbot,
        message: `✎ Conectado como ${numbot}`
      };
    }
    const code = await requestPairingCode(phone);
    return {
      ok: true,
      connected: false,
      code,
      message: `${code}`
    };
  }

  logger.post('/api/verify-recaptcha', async (req, res) => {
    const { token, action } = req.body;
    if (!token || !action) {
      return res.status(400).json({ message: 'Token o acción no proporcionados.' });
    }

    const secretKey = '6Lc82_crAAAAAFboG6u-ZAS6itgGSsh38sbEJDiW';

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
      });

      const data = await response.json();

      if (!data.success || data.action !== action || data.score < 0.5) {
        return res.status(400).json({ message: 'Verificación de reCAPTCHA fallida.' });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en la verificación de reCAPTCHA.' });
    }
  });

logger.post('/start-pairing', async (req, res) => {
  const { phone, label } = req.body;
  if (!phone) return res.status(400).json({ message: 'Número de teléfono no proporcionado' });

  const pho = normalizePhoneForPairing(phone);
  const now = Date.now();

  const basePath = path.join(__dirname, '../../Sessions/',
    'Subs', pho
  ); 

  const botRecord = { 
    idDigits: pho, 
    jid: pho + "@s.whatsapp.net", 
    label: label || null, 
    status: 'pending', 
    createdAt: now, 
    updatedAt: now
  };

  try {
    const pairingResult = await startPairing(phone);
    if (pairingResult.connected) {
      return res.json({
        message: `✎ Bot conectado como ${pairingResult.number}. Cargando edición...`,
        connected: true,
        number: pairingResult.number
      });
    }
    res.json({ ok: true, id: botRecord.jid, code: pairingResult.code, status: pairingResult.status, bot: botRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Error al conectar el bot.' });
  }
});

  logger.post('/edit-bot', async (req, res) => {
    const { phone, longName, shortName, canal, prefix, owner, banner, icon, currency, link } = req.body;
    if (!phone) return res.status(400).json({ message: 'Número de teléfono no proporcionado' });

   try {
    const phoneNormalized = normalizePhoneForPairing(phone);

    const clean = phone.replace(/\D/g, '');

    const idBot = phoneNormalized ? phoneNormalized + "@s.whatsapp.net" : clean || phone.replace(/\D/g, '');

if (!global.db.data.settings[idBot]) {
  global.db.data.settings[idBot] = {};
}

      const channelUrl = canal.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]

    const info = await client.newsletterMetadata('invite', channelUrl);
    if (!info) {
      return res.status(404).json({ message: 'No se pudo obtener información del canal.' });
    }

    global.db.data.settings[idBot] = {
      botname: longName || global.db.data.settings[idBot].botname,
      namebot: shortName || global.db.data.settings[idBot].namebot,
      banner: banner || global.db.data.settings[idBot].banner,
      icon: icon || global.db.data.settings[idBot].icon,
      currency: currency || global.db.data.settings[idBot].currency,
      prefix: prefix || global.db.data.settings[idBot].prefix,
      owner: owner || global.db.data.settings[idBot].owner,
      self: global.db.data.settings[idBot].self,
      id: info.id || global.db.data.settings[idBot]?.id, 
      nameid: info.thread_metadata?.name?.text || global.db.data.settings[idBot]?.nameid,
      type: global.db.data.settings[idBot].type || '',
      link: link || global.db.data.settings[idBot].link,
      canal: canal || global.db.data.settings[idBot].canal,l
    };

   res.json({ message: 'Configuración creada y actualizada.' });
    } catch (e) {
    res.json({ message: `Fail :: [${e}]` });
    }
  });

logger.post('/ver-configs', async (req, res) => {
     const { phone } = req.body;
     if (!phone) return res.status(400).json({ message: 'Número de teléfono no proporcionado' });
     try {
         const phoneNormalized = normalizePhoneForPairing(phone);
         const idBot = phoneNormalized ? phoneNormalized + "@s.whatsapp.net" : phone.replace(/\D/g, '') + "@s.whatsapp.net";

         if (!global.db.data.settings[idBot]) {
             return res.status(404).json({ 
                // message: 'Configuración no encontrada, se usarán valores por defecto',
                 config: {
                     botname: 'Alya San',
                     namebot: 'Alya',
                     banner: 'https://cdn.sockywa.xyz/files/JmRs.jpeg',
                     icon: 'https://cdn.sockywa.xyz/files/RTnq.jpeg',
                     currency: 'Coins',
                     prefix: '/',
                     owner: 'Oculto por privacidad',
                     canal: 'https://whatsapp.com/channel/0029VbApwZ9ISTkEBb6ttS3F',
                     link: 'https://api.stellarwa.xyz'
                 }
             });
         }

         let channelInfo = {};
         if (global.db.data.settings[idBot].canal) {
             const channelUrl = global.db.data.settings[idBot].canal.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
             if (channelUrl) {
                 try {
                     const info = await client.newsletterMetadata('invite', channelUrl);
                     channelInfo = {
                         id: info.id,
                         nameid: info.thread_metadata?.name?.text
                     };
                 } catch (e) {
                     console.log('No se pudo obtener info del canal:', e);
                 }
             }
         }

         res.json({
             message: 'Configuración obtenida exitosamente',
             config: {
                 namebot: global.db.data.settings[idBot].botname,
                 namebot2: global.db.data.settings[idBot].namebot,
                 banner: global.db.data.settings[idBot].banner,
                 icon: global.db.data.settings[idBot].icon,
                 currency: global.db.data.settings[idBot].currency,
                 prefijo: global.db.data.settings[idBot].prefix,
                 id: global.db.data.settings[idBot].id, 
                 nameid: global.db.data.settings[idBot].nameid,
                 owner: global.db.data.settings[idBot].owner,
                 canal: global.db.data.settings[idBot].canal,
                 link: global.db.data.settings[idBot].link
             }
         });
     } catch (e) {
         res.status(500).json({ message: `Error al obtener configuración :: [${e.message}]` });
     }
 });

logger.post('/delete-bot', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Número de teléfono no proporcionado' });
  }

  const pho = normalizePhoneForPairing(phone);

  const sessionDirs = ['Subs'];

  let deleted = false;

  for (const dir of sessionDirs) {
    const botSessionPath = path.join(__dirname, 'Sessions', dir, pho);

    if (fs.existsSync(botSessionPath)) {
      try {
        fs.rmSync(botSessionPath, { recursive: true, force: true });
        deleted = true;
      } catch (err) {
        return res.status(500).json({ message: `Error al eliminar la sesión en ${dir}` });
      }
    }
  }

  if (deleted) {
    res.json({ message: 'Bot eliminado exitosamente.' });
  } else {
    res.json({ message: 'Bot eliminado exitosamente.' });
  }
});

logger.get('/bots/status', async (req, res) => {
  try {
    const phone = String(req.query.phone || '').trim();
    if (!phone) return res.status(400).json({ ok: false, error: 'El campo phone es requerido.' });

    const idDigits = normalizePhoneForPairing(phone); 

    const s = await getStatus(idDigits); 
    const a = s.connected ? 'online' : 'offline'

    res.json({ ok: true, id: idDigits + "@s.whatsapp.net", status: a }); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error interno' });
  }
});

  logger.listen(PORT, () => {
  });
  
  async function joinChannels(client) {
    for (const value of Object.values(global.my)) {
      if (typeof value === 'string' && value.endsWith('@newsletter')) {
        await client.newsletterFollow(value).catch(err => console.log(chalk.gray(`\n[ ✿ ] Error al seguir el canal ${value}`)));
      }
    }
  }
}