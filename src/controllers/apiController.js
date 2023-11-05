const { init } = require('../../config/database/postgres/models')
const { initMongo } = require('../../config/database/mongo/initDefaultValues')
const createTokenJWT = require('../../config/auth/functions/createTokenJWT')

require('dotenv/config')
const { API_IN_FUNCTION } = process.env

module.exports.ping = async (requisition, response, next) => {
  response.send('pong')
}

module.exports.status = async (requisition, response, next) => {
  response.send(API_IN_FUNCTION)
}

module.exports.init = async (requisition, response, next) => {
  // const res = await init()
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
}

module.exports.createToken = async (requisition, response, next) => {
  const { body, auth: { scope } } = requisition

  if (scope !== 'admin') {
    response.send({
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
