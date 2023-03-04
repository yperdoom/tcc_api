
require('dotenv/config')
const { MONGO_ENDPOINT } = process.env

const Logger = require('../../../src/controllers/loggerController')
const mongoose = require('mongoose')

let conn = null

module.exports.connect = async () => {
  if (conn == null) {
    try {
      conn = await mongoose.connect(MONGO_ENDPOINT)

    } catch (error) {
      Logger.error({
        ...error,
        type: 'database-error',
        local: 'mongo-connect'
      })
      conn = null
    }
  }

  return conn
}

module.exports.disconnect = async () => {
  try {
    return await mongoose.disconnect(MONGO_ENDPOINT)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'mongo-disconnect'
    })
  }
}
