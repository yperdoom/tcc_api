const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')

const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/factory/getTimeNow')

const createUser = require('../services/user/createUser')
const getUser = require('../services/user/getUser')
const getAllUsers = require('../services/user/getAllUsers')
const modifyUser = require('../services/user/modifyUser')
const deleteUser = require('../services/user/deleteUser')

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

  if (!fields.sucess) {
    return response.send(fields)
  }

  const verifyEmailExists = await getUser('email', body.email)
  if (verifyEmailExists) {
    return response.send({
      sucess: false,
      message: 'email already registered'
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

    if (!clientFields.sucess) {
      return response.send(clientFields)
    }
  }

  body.password = await crypt.hashPassword(body.password)

  const dataUser = await createUser(body)

  if (!dataUser) {
    return response.send({
      sucess: false,
      message: "it's not's possible to create a user account"
    })
  }
  if (body.scope === 'client') {
    body.client.created_at = getTimeNow()
    body.client.updated_at = getTimeNow()
    body.client.user_id = dataUser.user_id

    const dataClient = await createClient(body.client)

    if (!dataClient) {
      return response.send({
        sucess: false,
        message: "it's not's possible to create a client account"
      })
    }

    return response.send({
      sucess: true,
      message: 'user and client created',
      body: { ...dataUser, client: dataClient }
    })
  }

  if (body.scope === 'manager') {
    body.manager.created_at = getTimeNow()
    body.manager.updated_at = getTimeNow()
    body.manager.user_id = dataUser.user_id

    const dataManager = await createManager(body.manager)

    if (!dataManager) {
      return response.send({
        sucess: false,
        message: "it's not's possible to create a manager account"
      })
    }

    return response.send({
      sucess: true,
      message: 'user and manager created',
      body: { ...dataUser, manager: dataManager }
    })
  }

  return response.send({
    sucess: true,
    message: 'user created',
    body: dataUser
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

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const user = await modifyUser(userId, body)

  if (!user) {
    return response.send({
      sucess: false,
      message: "it's not's possible to modify a user"
    })
  }

  return response.send({
    sucess: true,
    message: 'user modified',
    body: user
  })
}

module.exports.delete = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await deleteUser(userId)

  if (!user) {
    return response.send({
      sucess: false,
      message: "it's not's possible to delete a user"
    })
  }

  response.send({
    sucess: true,
    message: 'user deleted'
  })
}

module.exports.getUser = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const user = await getUser('user_id', userId)

  if (!user) {
    return response.send({
      sucess: false,
      message: 'user not found'
    })
  }

  response.send({
    sucess: true,
    message: 'user founded',
    body: user
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const users = await getAllUsers()

  if (!users) {
    return response.send({
      sucess: false,
      message: 'Users not found'
    })
  }

  return response.send({
    sucess: true,
    message: 'Users located',
    body: {
      count_users_found: users.length,
      users_found: users
    }
  })
}

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
    user_id: user.user_id || '12345',
    name: user.name || 'pedro',
    email: user.email || 'pedro@mail',
    scope: user.scope || 'admin',
    phone: user.phone || '54996582060',
  }

  const token = createTokenJWT(objectToTokenize)

  return response.send({
    sucess: true,
    message: 'login with success',
    token
  })
}
