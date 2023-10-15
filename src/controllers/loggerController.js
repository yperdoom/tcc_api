const color = require('../services/factory/terminalColors')
const mongoOperator = require('../../config/database/mongo/mongoOperator')

module.exports = ({
  log: async (log) => {
    const message = {}

    if (log.message) { message.message = log.message }

    if (log.type) { message.type = log.type }

    if (log.local) { message.local = log.local }

    if (log.body) { message.body = log.body }

    console.log(color.blue, message)
  },
  error: async (error) => {
    const message = {}
    let count = 0

    if (error.code) { message.code = error.code } else { count += 1 }

    if (error.address) { message.address = error.address } else { count += 1 }

    if (error.detail) { message.detail = error.detail } else { count += 1 }

    if (error.message) { message.message = error.message }

    if (error.type) { message.type = error.type }

    if (error.local) { message.local = error.local }

    if (count < 3) {
      console.log(color.red, `count: ${count} :: `, error)
    }
    console.log(color.reset)
    console.log(color.red, message)
    console.log(color.reset)
  },
  saveLog: async (generationInfo, params) => {
    const document = {
      informations: 'testes com a quantidade de geração máxima',
      ...generationInfo,
      params
    }

    await mongoOperator.new('genlog', document)
  },
})
