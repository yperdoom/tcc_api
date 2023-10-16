const Logger = require('../../../src/controllers/loggerController')

const { initAdminUser } = require('../../../src/services/managments/user')
const { initFoods } = require('../../../src/services/managments/food')
const { initInfos } = require('../../../src/services/managments/info')
const mongoOperator = require('./mongoOperator')

module.exports.initMongo = async () => {
  const response = await _initDefaultValues()

  if (response.success) {
    Logger.log({ message: 'Tabelas iniciadas com sucesso' })
    return { success: true }
  }
  return response
}

const _initDefaultValues = async () => {
  const successObject = { success: true }

  try {
    await mongoOperator.connect()
    await initAdminUser()
    await initFoods()
    await initInfos()
    await mongoOperator.disconnect()
  } catch (error) {
    Logger.error({
      error,
      type: 'database-error',
      local: 'create-mongo-default-values'
    })

    successObject.success = false
    successObject.message = error.message
    successObject.body = error
  }

  return successObject
}