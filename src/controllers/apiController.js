const { init } = require('../../config/database/models')

require('dotenv/config')
const { API_IN_FUNCTION } = process.env

module.exports.ping = async (requisition, response, next) => {
  response.send('pong')
}

module.exports.status = async (requisition, response, next) => {
  response.send(API_IN_FUNCTION)
}

module.exports.init = async (requisition, response, next) => {
  const res = await init()

  response.send(res)
}
