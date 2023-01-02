require('dotenv/config')
const { API_IN_FUNCTION } = process.env

module.exports.ping = async (requisition, response, next) => {

  response.send('pong')
}

module.exports.status = async (requisition, response, next) => {

  response.send(API_IN_FUNCTION)
}
