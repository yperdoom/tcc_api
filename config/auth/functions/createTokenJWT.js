'use strict'

const jwt = require('jsonwebtoken')
require('dotenv/config')
const { AUTH_SECRET } = process.env

module.exports = (payload) => {
  return jwt.sign(payload, AUTH_SECRET)
}
