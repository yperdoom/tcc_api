const users = require('../../config/database/models/users')

module.exports.login = async (requisition, response, next) => {
  let responseMessage = {sucess: false, message:'search failed'}
  
  if (!requisition._body) {
    responseMessage = {sucess: false, message:'body not found'}
  } else {

    if (!requisition.body.user) {
      responseMessage = {sucess: false, message:'user not found'}
    }
    if (!requisition.body.password) {
      responseMessage = {sucess: false, message:'password not found'}
    }
  }

  const res = await users.login(requisition.body)

  if (!res) {
    responseMessage = {sucess: false, message:'data not found'}
  } else {
    responseMessage = {sucess: true, message:'user located', body: res}
  }

  response.send(responseMessage)
}
