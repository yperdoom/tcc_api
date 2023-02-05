
require('dotenv/config')
const { MONGO_ENDPOINT } = process.env

const logger = require('../../../src/controllers/loggerController')
const mongoose = require('mongoose')

let conn = null

module.exports.connect = async () => {
  if (conn == null) {
    try {
      conn = await mongoose.connect(MONGO_ENDPOINT)
    } catch (error) {
      logger.log(error.message, 'error', error)
      conn = null
    }
  }

  return conn
}

module.exports.disconnect = async () => {
  try {
    return await mongoose.disconnect(MONGO_ENDPOINT)
  } catch (error) {
    console.log(error)
  }
}
