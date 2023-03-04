'use strict'

const jwt = require('jsonwebtoken')
require('dotenv/config')
const { AUTH_SECRET } = process.env

module.exports = (objectToTokenize) => {
  return jwt.sign(objectToTokenize, AUTH_SECRET)
}
