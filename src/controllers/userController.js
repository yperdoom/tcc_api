const createTokenJWT = require('../../config/auth/functions/createTokenJWT')
const crypt = require('../../config/auth/functions/password')
const verifyFields = require('../services/factory/verifyFields')
const setUserToTokenize = require('../services/factory/setUserToTokenize')
const User = require('../services/managments/user')
const mongoOperator = require('../../config/database/mongo/mongoOperator')

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

  await mongoOperator.connect()
  const verifyEmailExists = await User.getOne({ email: body.email })
  if (verifyEmailExists) {
    return response.send({
      success: false,
      message: 'E-mail já cadastrado!'
    })
  }

  body.scope = 'client'
  body.password = await crypt.hashPassword(body.password)

  const objectToToken = setUserToTokenize(body)
  const token = createTokenJWT(objectToToken)

  body.client = {
    age: body.age,
    height: body.height,
    weight: body.weight,
    fat_percentage: body.fat_percentage,
    sex: body.sex,
    manager_id: body.manager_id
  }

  const dataUser = await User.create(body)
  await mongoOperator.disconnect()

  if (!dataUser) {
    return response.send({
      success: false,
      message: 'Não foi possível criar esta conta de usuário!'
    })
  }

  return response.send({
    success: true,
    message: 'Cliente cadastrado.',
    body: { ...dataUser, token }
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

  await mongoOperator.connect()
  const verifyEmailExists = await User.getOne({ email: body.email })
  if (verifyEmailExists) {
    return response.send({
      success: false,
      message: 'E-mail já cadastrado!'
    })
  }

  body.scope = 'manager'
  body.password = await crypt.hashPassword(body.password)


  const objectToToken = setUserToTokenize(body)
  const token = createTokenJWT(objectToToken)

  const dataUser = await User.create(body)
  await mongoOperator.disconnect()

  return response.send({
    success: true,
    message: 'Gestor criado.',
    body: { ...dataUser, token }
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

  await mongoOperator.connect()
  const user = await User.update({ _id: userId }, body)
  await mongoOperator.disconnect()

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
      ...user,
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

  await mongoOperator.connect()
  const user = await User.update({ _id: userId }, body)
  await mongoOperator.disconnect()

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
      ...user
    }
  })
}

module.exports.delete = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  let scope = requisition.body.scope

  await mongoOperator.connect()

  if (!scope) {
    const user = await User.getOne({ _id: userId })
    scope = user.scope
  }

  if (scope === 'client' || scope === 'manager') {
    return response.send({
      success: false,
      message: `Não é possível deletar este usuário, pois ele tem uma conta de ${scope} vinculada!`
    })
  }

  const user = await deleteUser(userId)
  await mongoOperator.disconnect()

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

  await mongoOperator.connect()
  const user = await User.getOne({ _id: userId })
  await mongoOperator.disconnect()

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário encontrado.',
    body: {
      ...user
    }
  })
}

module.exports.getManager = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  await mongoOperator.connect()
  const user = await User.getOne({ _id: userId })
  await mongoOperator.disconnect()

  if (!user) {
    return response.send({
      success: false,
      message: 'Usuário não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Usuário encontrado.',
    body: {
      ...user
    }
  })
}

module.exports.getAllClients = async (requisition, response, next) => {
  const managerUserId = requisition.params.manager_user_id

  await mongoOperator.connect()
  const clients = await User.get({ 'client.manager_id': managerUserId })
  await mongoOperator.disconnect()

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
  await mongoOperator.connect()
  const managers = await User.get({ scope: 'manager' })
  await mongoOperator.disconnect()

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
