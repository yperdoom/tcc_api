'use strict'

const decodeTokenJwt = require('./functions/decodeTokenJWT')

module.exports.authentication = async (requisition, response, next) => {
  const token = requisition.headers.authorization

  if (!token) {
    return response.send({
      success: false,
      message: 'token not found'
    })
  }
  requisition.auth = decodeTokenJwt(token.replace('Bearer ', ''))
  
  if (!requisition.auth) {
    return response.send({ success: false, message: 'Invalid token' })
  }

  next()
}
