'use strict'

const Logger = require('../../../src/controllers/loggerController')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { AUTH_SECRET } = process.env

module.exports = (objectToTokenize) => {
  try {
    return jwt.sign(objectToTokenize, AUTH_SECRET)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'token-error',
      local: 'create-token-jwt'
    })
    return null
  }
}
