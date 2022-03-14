function showRequestConsole(req, res, next) {
  const url = `${req.get('host')}${req.originalUrl}`
  console.log(`[${req.method}] ${url}`)
  req.endpoint = url
  next()
}

module.exports = showRequestConsole