const color = require('../services/factory/terminalColors')
const GeneratioLog = require('../../config/database/mongo/models/GenerationLog')
const mongoConnection = require('../../config/database/mongo/mongoConnection')

module.exports = ({
  log: (log) => {
    const message = {}

    if (log.message) {
      message.message = log.message
    }

    if (log.type) {
      message.type = log.type
    }

    if (log.local) {
      message.local = log.local
    }

    if (log.body) {
      message.body = log.body
    }

    console.log(color.blue)
    console.log(message)
    console.log(color.reset)
  },
  error: (error) => {
    const message = {}

    if (error.code) {
      message.code = error.code
    }

    if (error.address) {
      message.address = error.address
    }

    if (error.message) {
      message.message = error.message
    }

    if (error.type) {
      message.type = error.type
    }

    if (error.local) {
      message.local = error.local
    }

    console.log(color.red)
    console.log(message)
    console.log(color.reset)
  },
  saveLog: async (generationInfo, parameters) => {
    const document = {
      ...generationInfo,
      parameters
    }

    await GeneratioLog.create(document)
  },
  openConnectToSaveLogs: async () => {
    await mongoConnection.connect()
  },
  closeConnection: async () => {
    await mongoConnection.disconnect()
  }
})
