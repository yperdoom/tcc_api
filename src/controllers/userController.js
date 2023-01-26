const { DateTime } = require('luxon')

const verifyFields = require('../../config/verify/verifyFields')
const crypt = require('../../config/auth/functions/password')

const createUser = require('../services/user/createUser')
const getUser = require('../services/user/getUser')
const getAllUsers = require('../services/user/getAllUsers')
const modifyUser = require('../services/user/modifyUser')
const deleteUser = require('../services/user/deleteUser')

const createClient = require('../services/client/createClient')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, ['name', 'email', 'password', 'phone', 'birthday'])
  
  if (!fields.sucess) {
    return response.send(fields)
  }

  const verifyEmailExists = await getUser('email', body.email)
  if (verifyEmailExists) {
    return response.send({sucess: false, message:'email already registered'})
  }

  body.created_at = DateTime.now().setZone("America/Sao_Paulo")
  body.updated_at = DateTime.now().setZone("America/Sao_Paulo")
  
  if (!body.scope) {
    body.scope = 'user'
  }

  if (body.scope == 'client') {
    const clientFields = verifyFields(body.client, ['age', 'height', 'weigth', 'fat_percentage', 'sex'])

    if (!clientFields.sucess) {
      return response.send(clientFields)
    }
  }

  body.password = await crypt.hashPassword(body.password)

  const user = await createUser(body)

  if (!user) {
    return response.send({sucess: false, message:"it's not's possible to create a user account"})
  }
if (body.scope == 'client') {
    body.client.created_at = body.created_at
    body.client.updated_at = body.updated_at
    body.client.user_id = user.user_id

    const client = await createClient(body.client)

    if (!client) {
      return response.send({sucess: false, message:"it's not's possible to create a client account"})
    }

    return response.send({sucess: true, message:'user and client created', body: {... user, client: resClient}})
  }
    
  return response.send({sucess: true, message:'user created', body: user})
}

module.exports.modify = async (requisition, response, next) => {
  const { user_id } = requisition.params
  const { body } = requisition

  const fields = verifyFields(body, ['name', 'password', 'phone', 'birthday'])
  
  if (!fields.sucess) {
    return response.send(fields)
  }

  body.updated_at = DateTime.now().setZone("America/Sao_Paulo")
  body.password = await crypt.hashPassword(body.password)

  const user = await modifyUser(user_id, body)

  if (!user) {
    return response.send({sucess: false, message:"it's not's possible to modify a user"})
  }
  
  return response.send({sucess: true, message:'user modified', body: user})
}

module.exports.delete = async (requisition, response, next) => {
  const { user_id } = requisition.params

  const user = await deleteUser(user_id)

  if (!user) {
    return response.send({sucess: false, message:"it's not's possible to delete a user"})
  }

  response.send({sucess: true, message:'user deleted'})
}

module.exports.getUser = async (requisition, response, next) => {
  const { user_id } = requisition.params

  const user = await getUser('user_id', user_id)

  if (!user) {
    return response.send({sucess: false, message:"user not found"})
  }

  response.send({sucess: true, message:'user founded', body: user})
}

module.exports.getAll = async (requisition, response, next) => {

  const users = await getAllUsers()

  if (!users) {
    return response.send({sucess: false, message:'Users not found'})
  }

  return response.send({sucess: true, message:'Users located', body: users})
}

module.exports.login = async (requisition, response, next) => {
  const body = requisition.body

  const fields = verifyFields(body, ['email', 'password'])
  if (!fields.sucess) {
    return response.send(fields)
  }

  const user = await getUser('email', body.email)

  console.log(user)
  if (!user) {
    return response.send({sucess: false, message:'user not found'})
  }

  const pass = await crypt.comparePassword(body.password, user.password)

  if (!pass) {
    return response.send({sucess: false, message:'password incorrect'})
  }

  return response.send({sucess: true, message:'user located', body: user})
}
