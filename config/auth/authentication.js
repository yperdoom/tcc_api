'use strict'

// const createTokenJwt = require('./functions/createTokenJwt')
// const decodeTokenJwt = require('./functions/decodeTokenJwt')

module.exports.authentication = (requisition, response, next) => {
  console.log('authenticated')
  next()
}
