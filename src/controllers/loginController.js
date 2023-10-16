const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')
const mongoOperator = require('../../config/database/mongo/mongoOperator')
const verifyFields = require('../services/factory/verifyFields')
const { get: getUser } = require('../services/managments/user')

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const fields = verifyFields(body, [
    'email',
    'password'
  ])
  if (!fields.success) {
    return response.send(fields)
  }

  await mongoOperator.connect()
  const user = await getUser({ email: body.email })
  await mongoOperator.disconnect()

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  const pass = await crypt.comparePassword(body.password, user.password)

  if (!pass) {
    return response.send({
      success: false,
      message: 'Senha incorreta!'
    })
  }

  const objectToTokenize = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    scope: user.scope,
    phone: user.phone
  }

  const token = createTokenJWT(objectToTokenize)

  return response.send({
    success: true,
    message: 'Login bem sucedido.',
    scope: user.scope,
    userId: user.user_id,
    token
  })
}
