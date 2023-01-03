const { DateTime } = require('luxon')

const users = require('../../config/database/models/users')

module.exports.create = async (requisition, response, next) => {
  let responseMessage = {sucess: false, message:'search failed'}
  
  if (!requisition._body) {
    responseMessage = {sucess: false, message:'body not found'}
  }

  requisition.body.created_at = DateTime.now().setZone("America/Sao_Paulo")
  requisition.body.updated_at = DateTime.now().setZone("America/Sao_Paulo")
  
  const res = await users.create(requisition.body)


  if (!res) {
    responseMessage = {sucess: false, message:'data not found'}
  } else {
    responseMessage = {sucess: true, message:'user located', body: res}
  }

  response.send(responseMessage)
}
