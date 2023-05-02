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

  const user = await getUser('email', body.email)

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  const pass = await crypt.comparePassword(body.password, user[0].password)

  if (!pass) {
    return response.send({
      success: false,
      message: 'Senha incorreta!'
    })
  }

  const objectToTokenize = {
    user_id: user[0].user_id,
    name: user[0].name,
    email: user[0].email,
    scope: user[0].scope,
    phone: user[0].phone
  }

  const token = createTokenJWT(objectToTokenize)

  return response.send({
    success: true,
    message: 'Login bem sucedido.',
    scope: user[0].scope,
    userId: user[0].user_id,
    token
  })
}
