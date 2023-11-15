const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')
const { getOne: getUser } = require('../user/userService')

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const { email, password } = body

  const user = await getUser({ email }, 'password name email scope phone client.manager_id')

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
    user_id: user._id,
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
    userId: user._id,
    managerId: user?.client?.manager_id,
    token
  })
}
