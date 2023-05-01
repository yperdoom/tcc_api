// ||||| ALL IMPORTS |||||
// config and auth
const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')

// factoryes services
const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/factory/getTimeNow')
const setUserToTokenize = require('../services/factory/setUserToTokenize')

// user services
const createUser = require('../services/user/createUser')
const getUser = require('../services/user/getUser')
const getAllUsers = require('../services/user/getAllUsers')
const modifyUser = require('../services/user/modifyUser')
const deleteUser = require('../services/user/deleteUser')

// other services
const createClient = require('../services/client/createClient')
const createManager = require('../services/manager/createManager')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'email',
    'password',
    'phone',
    'birthday'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  const verifyEmailExists = await getUser('email', body.email)
  if (verifyEmailExists) {
    return response.send({
      success: false,
      message: 'E-mail já cadastrado!'
    })
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  if (!body.scope) {
    body.scope = 'user'
  }

  if (body.scope === 'client') {
    const clientFields = verifyFields(body.client, [
      'age',
      'height',
      'weight',
      'fat_percentage',
      'sex',
      'manager_id'
    ])

    if (!clientFields.success) {
      return response.send(clientFields)
    }
  }

  body.password = await crypt.hashPassword(body.password)

  const dataUser = await createUser(body)

  const objectToToken = setUserToTokenize(body)
  const token = createTokenJWT(objectToToken)

  if (!dataUser) {
    return response.send({
      success: false,
      message: 'Não foi possível criar esta conta de usuário!'
    })
  }
  if (body.scope === 'client') {
    body.client.created_at = getTimeNow()
    body.client.updated_at = getTimeNow()
    body.client.user_id = dataUser.user_id

    const dataClient = await createClient(body.client)

    if (!dataClient) {
      return response.send({
        success: false,
        message: 'Não foi possível criar esta conta de cliente!'
      })
    }

    return response.send({
      success: true,
      message: 'Cliente cadastrado.',
      body: { ...dataUser[0], client: dataClient[0], token }
    })
  }

  if (body.scope === 'manager') {
    body.manager.created_at = getTimeNow()
    body.manager.updated_at = getTimeNow()
    body.manager.user_id = dataUser.user_id

    const dataManager = await createManager(body.manager)

    if (!dataManager) {
      return response.send({
        success: false,
        message: 'Não foi possível criar esta conta de gestor!'
      })
    }

    return response.send({
      success: true,
      message: 'Gestor criado.',
      body: { ...dataUser[0], manager: dataManager[0], token }
    })
  }

  return response.send({
    success: true,
    message: 'Usuário criado.',
    body: dataUser[0],
    token
  })
}

module.exports.modify = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'phone',
    'birthday'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const user = await modifyUser(userId, body)

  if (!user) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este usuário!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário modificado.',
    body: user[0]
  })
}

module.exports.delete = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await deleteUser(userId)

  if (!user) {
    return response.send({
      success: false,
      message: 'Não foi possível deletar este usuário!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário deletado.'
  })
}

module.exports.getUser = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await getUser('user_id', userId)

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário encontrado.',
    body: user[0]
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const users = await getAllUsers()

  if (!users) {
    return response.send({
      success: false,
      message: 'Nenhum usuário encontrado!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário(s) encontrado(s).',
    body: {
      count_users_found: users.length,
      users_found: users
    }
  })
}
