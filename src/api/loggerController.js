const color = require('../factory/terminalColors')
const mongoOperator = require('../../config/database/mongo/mongoOperator')

module.exports = ({
  trace: async (message, locale = 'init-route') => {
    if (locale === 'start') {
      console.log(color.purple, message)
    }
    if (locale === 'init') {
      console.log(color.yellow, message)
    }
    if (locale === 'init-route') {
      console.log(color.green, message)
    }
    if (locale === 'end') {
      console.log(color.blue, message)
    }
  },
  log: async (log) => {
    const type = color.blue

    if (log.message) { print('message: ' + log.message, type) }
    if (log.type) { print('type: ' + log.type, type) }
    if (log.local) { print('local: ' + log.local, type) }
    if (log.body) { print('body: ' + log.body, type) }
  },
  error: async (error) => {
    const type = color.red

    if (error.message) { print('message: ' + error.message, type) }
    if (error.type) { print('type: ' + error.type, type) }
    if (error.local) { print('local: ' + error.local, type) }
    if (error.code) { print('code: ' + error.code, type) }
    if (error.address) { print('address: ' + error.address, type) }
    if (error.detail) { print('detail: ' + error.detail, type) }
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

const print = (message, type) => {
  console.log(type, message)
}
