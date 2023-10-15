const Logger = require('../../../src/controllers/loggerController')

const { initAdminUser } = require('../../../src/services/user/managementUser')
const { initFoods } = require('../../../src/services/food/managementFood')
const { initInfos } = require('../../../src/services/info/managementInfo')

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
    await initAdminUser()
    await initFoods()
    await initInfos()
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
