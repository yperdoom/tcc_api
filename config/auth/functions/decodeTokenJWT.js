'use strict'

const jwt = require('jsonwebtoken')
require('dotenv/config')
const { AUTH_SECRET } = process.env

module.exports = (token) => {
  return jwt.verify(token, AUTH_SECRET)
}