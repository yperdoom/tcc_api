const userModel = require('../../config/database/models/user')

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

  const res = await userModel.login(requisition.body)

  if (!res) {
    responseMessage = {sucess: false, message:'data not found'}
  } else {
    responseMessage = {sucess: true, message:'user located', body: res}
  }

  response.send(responseMessage)
}
