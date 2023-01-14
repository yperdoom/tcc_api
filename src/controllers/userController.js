const { DateTime } = require('luxon')
const { ClientBase } = require('pg')

const userModel = require('../../config/database/models/user')

module.exports.create = async (requisition, response, next) => {
  let responseMessage = {sucess: false, message:'create failed'}//search
  
  if (!requisition._body) {
    responseMessage = {sucess: false, message:'body not found'}
  }

  const body = requisition.body

  body.created_at = DateTime.now().setZone("America/Sao_Paulo")
  body.updated_at = DateTime.now().setZone("America/Sao_Paulo")

  if (!body.scope) {
    body.scope = 'user'
  }

  const res = await userModel.create(body)



  if (!res) {
    responseMessage = {sucess: false, message:'data not found'}
  } else {

    // criar client
    if (body.scope == 'client') {
      const resClient = await clientModel.create(body.client)
      
      if (!resClient) {
        responseMessage = {sucess: false, message:"it's not's possible to create a client account"}
      } else {
      responseMessage = {sucess: true, message:'client created', body: {... res, client: resClient}}
      }
    }


    responseMessage = {sucess: true, message:'user located', body: res}
  }

  response.send(responseMessage)
}

module.exports.modify = async (requisition, response, next) => {
  let responseMessage = {sucess: false, message:'update failed'}//search
  
  if (!requisition._body) {
    responseMessage = {sucess: false, message:'body not found'}
  }

  requisition.body.updated_at = DateTime.now().setZone("America/Sao_Paulo")
  
  // const res = await users.modify(requisition.body)

  if (!res) {
    responseMessage = {sucess: false, message:'data not found'}
  } else {
    responseMessage = {sucess: true, message:'user located', body: res}
  }

  response.send(responseMessage)
}

module.exports.delete = async (requisition, response, next) => {
  let responseMessage = {statusCode: 501, message:'not implemented'}//search

  response.send(responseMessage)
}
