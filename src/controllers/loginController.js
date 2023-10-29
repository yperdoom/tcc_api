const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')
const mongoOperator = require('../../config/database/mongo/mongoOperator')
const verifyFields = require('../services/factory/verifyFields')
const { getOne: getUser } = require('../services/managments/user')

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const {email, password} = body
  if (email.length <= 5 || password.length <=3) {
    return response.send({success: false, message: 'Campos incompletos\n\n\nConfira a digitação do e-mail e senha e tente novamente'})
  }

  const user = await getUser({ email: body.email })

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
