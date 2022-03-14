const express = require('express')

const response = require('@network/response')
const Controller = require('./controller')

const router = express.Router()

// Routes
router.get('/', test)

//Functions Callbacks
function test(req, res, next) {
  Controller.test()
    .then((data) => {
      response.success(req, res, data, 200)
    }).catch(next)
}

module.exports = router