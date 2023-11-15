const { initMongo } = require('../../config/database/mongo/initDefaultValues')
const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const Logger = require('./loggerController')

require('dotenv/config')
const { API_IN_FUNCTION } = process.env

module.exports.ping = async (requisition, response, next) => {
  Logger.trace('start :: ping :: api controller')
  response.send('pong')
  Logger.trace('end :: ping :: api controller', 'end')
}

module.exports.status = async (requisition, response, next) => {
  Logger.trace('start :: status :: api controller')
  response.send(API_IN_FUNCTION)
  Logger.trace('end :: status :: api controller', 'end')
}

module.exports.init = async (requisition, response, next) => {
  Logger.trace('start :: init :: api controller')
  const res = await initMongo()

  if (!res.success) {
    return response.send({
      success: false,
      message: res.message,
      body: res.body
    })
  }

  response.send({
    success: true,
    message: 'Todas as tabelas foram criadas com sucesso.'
  })
  Logger.trace('tabelas criadas com sucesso :: init :: api controller', 'end')
}

module.exports.createToken = async (requisition, response, next) => {
  Logger.trace('init create token :: api controller')
  const { body, auth: { scope } } = requisition

  if (scope !== 'admin') {
    return response.send({
      success: false,
      message: 'Nâo permitido.'
    }).code(403)
  }
  const objectToTokenize = {}
  if (body.name) { objectToTokenize.name = body.name }
  if (body.email) { objectToTokenize.email = body.email }
  if (body.phone) { objectToTokenize.phone = body.phone }
  if (body.user_id) { objectToTokenize.user_id = body.user_id }
  objectToTokenize.scope = 'basic'

  const token = createTokenJWT(objectToTokenize)
  if (!token) {
    return response.send({
      success: false,
      message: 'Não foi possível criar o token.'
    })
  }

  response.send({
    success: true,
    message: 'Token criado.',
    body: token
  })
}
