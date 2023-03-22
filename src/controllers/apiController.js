const { init } = require('../../config/database/postgres/models')

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

  if (!res.success) {
    response.send({
      success: false,
      message: res.message,
      body: res.body
    })
  }

  response.send({
    success: true,
    message: 'all tables were created successfully'
  })
}
