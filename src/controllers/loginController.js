const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')

const verifyFields = require('../services/factory/verifyFields')
const getUser = require('../services/user/getUser')

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const fields = verifyFields(body, [
    'email',
    'password'
  ])
  if (!fields.success) {
    return response.send(fields)
  }

  const user = await getUser(body.email)

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
