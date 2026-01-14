import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import yargs from 'yargs/yargs'

global.opts = Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbFile = path.join(process.cwd(), 'lib', 'database.json')

global.db = {
  data: {
    users: {},
    chats: {},
    settings: {},
    characters: {}
  },
  chain: null,
  READ: false,
  _snapshot: '{}'
}
global.DATABASE = global.db
global.loadDatabase = function loadDatabase() {
  if (global.db.READ) return global.db.data
  global.db.READ = true
  
  if (fs.existsSync(dbFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
      global.db.data = Object.assign(global.db.data, parsed)
    } catch {}
  }
  global.db.chain = _.chain(global.db.data)
  global.db.READ = false
  global.db._snapshot = JSON.stringify(global.db.data)
  return global.db.data
}

function hasPendingChanges() {
  return global.db._snapshot !== JSON.stringify(global.db.data)
}

global.saveDatabase = function saveDatabase() {
  if (!hasPendingChanges()) return
  fs.writeFileSync(dbFile, JSON.stringify(global.db.data, null, 2))
  global.db._snapshot = JSON.stringify(global.db.data)
}

let lastSave = Date.now()
setInterval(() => {
  const now = Date.now()
  const elapsed = now - lastSave
  if (elapsed >= 1000 && hasPendingChanges()) {
    global.saveDatabase()
    lastSave = now
  }
}, 500)

export default global.db