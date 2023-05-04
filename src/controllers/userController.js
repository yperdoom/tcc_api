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
const modifyUser = require('../services/user/modifyUser')
const deleteUser = require('../services/user/deleteUser')

// other services
const createClient = require('../services/client/createClient')
const modifyClient = require('../services/client/modifyClient')
const getAllClients = require('../services/client/getAllClients')
const getClient = require('../services/client/getClient')
const createManager = require('../services/manager/createManager')
const modifyManager = require('../services/manager/modifyManager')
const getAllManagers = require('../services/manager/getAllManagers')
const getManager = require('../services/manager/getManager')

module.exports.createClient = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'email',
    'password',
    'phone',
    'birthday',
    'age',
    'height',
    'weight',
    'fat_percentage',
    'sex',
    'manager_id'
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
  body.scope = 'client'
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

  body.user_id = dataUser[0].user_id

  const dataClient = await createClient(body)

  if (!dataClient) {
    deleteUser(dataUser[0].user_id)

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

module.exports.createManager = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'email',
    'password',
    'phone',
    'birthday',
    'document'
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
  body.scope = 'manager'
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

  body.manager = {
    document: body.document,
    user_id: dataUser[0].user_id,
    created_at: getTimeNow(),
    updated_at: getTimeNow()
  }

  const dataManager = await createManager(body.manager)

  if (!dataManager) {
    deleteUser(dataUser[0].user_id)

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

module.exports.modifyClient = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'phone',
    'birthday',
    'age',
    'height',
    'weight',
    'fat_percentage',
    'sex'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const user = await modifyUser(userId, body)
  const client = await modifyClient(userId, body)

  if (!user) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este usuário!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário modificado.',
    body: {
      ...user[0],
      client: client[0]
    }
  })
}

module.exports.modifyManager = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'phone',
    'birthday',
    'document'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const user = await modifyUser(userId, body)
  const manager = await modifyManager(userId, body)

  if (!user) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este usuário!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário modificado.',
    body: {
      ...user[0],
      manager: manager[0]
    }
  })
}

module.exports.delete = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  let scope = requisition.body.scope

  if (!scope) {
    const user = await getUser('user_id', userId)
    scope = user[0].scope
  }

  if (scope === 'client' || scope === 'manager') {
    return response.send({
      success: false,
      message: `Não é possível deletar este usuário, pois ele tem uma conta de ${scope} vinculada!`
    })
  }

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

module.exports.getClient = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await getUser('user_id', userId)
  const client = await getClient('user_id', userId)

  if (!user || !client) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário encontrado.',
    body: {
      ...user[0],
      client: client[0]
    }
  })
}

module.exports.getManager = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await getUser('user_id', userId)
  const manager = await getManager('user_id', userId)

  if (!user || !manager) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário encontrado.',
    body: {
      ...user[0],
      manager: manager[0]
    }
  })
}

module.exports.getAllClients = async (requisition, response, next) => {
  const clients = await getAllClients()

  if (!clients) {
    return response.send({
      success: false,
      message: 'Nenhum usuário encontrado!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário(s) encontrado(s).',
    body: {
      count: clients.length,
      clients
    }
  })
}

module.exports.getAllManagers = async (requisition, response, next) => {
  const managers = await getAllManagers()

  if (!managers) {
    return response.send({
      success: false,
      message: 'Nenhum usuário encontrado!'
    })
  }

  return response.send({
    success: true,
    message: 'Usuário(s) encontrado(s).',
    body: {
      count: managers.length,
      managers
    }
  })
}
