function HttpException(message = 'Error Interno', code) {
  const e = new Error(message)
  if (code) e.statusCode = code

  return e
}

module.exports = HttpException