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
  if (!fields.sucess) {
    return response.send(fields)
  }

  const user = await getUser('email', body.email)

  if (!user) {
    return response.send({
      sucess: false,
      message: 'user not found'
    })
  }

  const pass = await crypt.comparePassword(body.password, user.password)

  if (!pass) {
    return response.send({
      sucess: false,
      message: 'password incorrect'
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
    sucess: true,
    message: 'login with success',
    body: token
  })
}
