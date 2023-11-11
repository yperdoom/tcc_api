const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')
const mongoOperator = require('../../config/database/mongo/mongoOperator')
const verifyFields = require('../services/factory/verifyFields')
const { getOne: getUser } = require('../services/managments/user')

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const { email, password } = body

  const user = await getUser({ email })

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  const pass = await crypt.comparePassword(password, user.password)

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
