const config = require('@config')

let store, cache

/* if (config.remoteDB === true) {
  store = require('@store/remote-mysql')
  cache = require('@store/remote-cache')
} else {
  cache = require('@store/redis')
} */

store = require('@store/mssql')
const ctrl = require('./controller')

module.exports = ctrl(store, cache)
