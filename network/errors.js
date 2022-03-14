const response = require('./response')

function errors(err, req, res, next) {
  let { message, statusCode } = err
  console.error('[error]', err)
  console.error('[error] message', message)
  console.error('[error] statusCode', statusCode)

  message = message || 'Error interno'
  statusCode = statusCode || 500

  response.error(req, res, message, statusCode)
}

module.exports = errors