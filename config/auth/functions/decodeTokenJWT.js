'use strict'

const Logger = require('../../../src/controllers/loggerController')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { AUTH_SECRET } = process.env

module.exports = (token) => {
  try {
    return jwt.verify(token, AUTH_SECRET)
  } catch (error) {
    Logger.error({
      error,
      type: 'token-error',
      local: 'decode-token-jwt'
    })
    return null
  }
}
