exports.success = function (req, res, data = null, status = 200) {
  res.status(status).json({
    error: false,
    status: status,
    data: data
  })
}

exports.error = function (req, res, data = 'Internal server error', status = 500) {
  res.status(status).send({
    error: data,
    status: status,
    data: null
  })
}