require('dotenv').config()

module.exports = {
    isDev: process.env.NODE_ENV !== 'production',
  PORT_WHT: process.env.PORT_WHT || 9000,
  
  api: {
    port: process.env.API_PORT || 5010
  },

  connection: {
    mssql: false,
    whatsapp: false,
  },

  hosts: {
    app: '',
    api: '',
    whatsapp: 'http://localhost:9000/whatsapp',
  },

  // SQLServer
  mssql: {
    server: process.env.SQLSRV_SERVER,
    user: process.env.SQLSRV_USER,
    password: process.env.SQLSRV_PASSWORD,
    database: process.env.SQLSRV_DATABASE,
    port: process.env.SQLSRV_PORT
  },
  
}
