
require('dotenv/config')
const { MONGO_ENDPOINT } = process.env

const Logger = require('../../../src/api/loggerController')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

let conn = null

module.exports.connect = async () => {
  if (conn == null) {
    try {
      conn = mongoose.connect(MONGO_ENDPOINT)
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
    mongoose.disconnect(MONGO_ENDPOINT)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'mongo-disconnect'
    })
  }
}
