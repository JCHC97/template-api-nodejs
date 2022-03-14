require('module-alias/register')
const express = require('express')
const cors = require('cors')

const errors = require('@network/errors')
const config = require('@config')

const testRouter = require('./components/test/routes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Router
app.use('/api/test', testRouter)

// Error Handlers
app.use(errors)

app.listen(config.api.port, () => {
  console.log('API listen on port ', config.api.port)
})