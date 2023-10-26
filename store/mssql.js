const mssql = require('mssql')
const config = require('@config')

const dbConfig = {
  server: config.mssql.server,
  user: config.mssql.user,
  password: config.mssql.password,
  port: config.mssql.port && parseInt(config.mssql.port),
  database: config.mssql.database,
  connectionTimeout: 60000,
  requestTimeout: 60000,
  options: {
    encrypt: false, // for azure
    enableArithAbort: true,
    trustServerCertificate: false, // change to true for local dev / self-signed certs
    connectionTimeout: 60000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 60000
  }
}

const connectionString =
  `mssql://${dbConfig.user}:${dbConfig.password}@${dbConfig.server}/${dbConfig.database};connectionTimeout=30000`

// Connection
let connection

async function handleCon() {
  /* try{
    connection = await mssql.connect(connectionString)
  }catch (err){
    console.error('[db err] connection', err)
    return setTimeout(handleCon, 1000 * 2)
  }
 */
  try {
    connection = await mssql.connect(dbConfig)
  } catch (err) { throw err }

  connection.connect((err) => {
    if (err) {
      console.error('[db err]', err)
      return setTimeout(handleCon, 1000 * 2)
    }

    console.log(`Conectado a SQLServer (${dbConfig.server}/${dbConfig.user})`)
    config.connection.mssql = true
  })

  connection.on('error', err => {
    console.error('[db err]', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleCon()
    } else {
      throw err
    }
  })

}

handleCon()

function formatFieldsSelect(fields) {
  if (!fields) return '*'
  return fields.reduce((acc, curr) => {
    return acc.concat(`${acc ? ',' : ''} ${curr}`)
  }, '')
}

//Functions
function list(table, { top, selects }) {
  const topSQL = `TOP(${top || 100})`
  const selectsSQL = formatFieldsSelect(selects)
  return new Promise((resolve, reject) => {
    connection.query(`SELECT ${topSQL} ${selectsSQL} FROM ${table}`, (err, result) => {
      if (err) return reject(err)
      resolve(result.recordset)
    })
  })
}

function get(table, { id }) {
  return new Promise((resolve, reject) => {
    const [field, value] = Object.entries(id)[0]
    connection.query(`SELECT * FROM ${table} WHERE ${field}='${value.trim()}'`, (err, result) => {
      if (err) return reject(err)
      resolve(result.recordset[0])
    })
  })
}

function insert(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      if (err) return reject(err)
      resolve(result.recordset)
    })
  })
}

function update(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

function upsert(table, data) {
  if (data && data.id) {
    return update(table, data)
  } else {
    return insert(table, data)
  }
}

/* const upsert = async (table, data) => {
    let row = []
    if(data.id){
        row = await get(table, data.id)
    }
    if (row.length === 0) {
      return insert(table, data);
    } else {
      return update(table, data);
    }
} */

function query(table, query, join) {
  let joinQuery = ''
  if (join) {
    const key = Object.keys(join)[0]
    const val = join[key]
    joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`
  }

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, (err, res) => {
      if (err) return reject(err)
      resolve(res[0] || null)
    })
  })
}

function queryString(querySql, all) {
  try {
    // console.log({ querySql })
    return new Promise((resolve, reject) => {
      if (!connection) handleCon()
      connection.query(querySql, (err, result) => {
        if (err) return reject(err)
        // console.log({ result })
        if (!result.rowsAffected[0]) resolve([])
        if (all) resolve(result.recordsets)
        resolve(result.recordset || result.rowsAffected[0])
      })
    })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  connection,
  list,
  get,
  insert,
  update,
  upsert,
  query,
  queryString
}
