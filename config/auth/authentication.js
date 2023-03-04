'use strict'

// const createTokenJwt = require('./functions/createTokenJwt')
const decodeTokenJwt = require('./functions/decodeTokenJWT')

module.exports.authentication = (requisition, response, next) => {
  const token = requisition.headers.authorization

  if (!token) {
    return response.send({
      sucess: false,
      message: 'token not found'
    })
  }

  requisition.auth = decodeTokenJwt(token.replace('Bearer ', ''))

  next()
}
