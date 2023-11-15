const Logger = require('../../../src/api/loggerController')

const { initAdminUser } = require('../../../src/user/userService')
const { initFoods } = require('../../../src/food/foodService')
const { initInfos } = require('../../../src/info/infoService')
const mongoOperator = require('./mongoOperator')

module.exports.initMongo = async () => {
  Logger.trace('start init default values :: init default values :: mongo')
  const response = await _initDefaultValues()

  if (response.success) {
    Logger.trace('dados inseridos com sucesso :: init default values :: mongo')
    return { success: true }
  }
  return response
}

const _initDefaultValues = async () => {
  const successObject = { success: true }

  try {
    await initAdminUser()
    Logger.trace('admin user created :: init default values :: mongo')
    await initFoods()
    Logger.trace('foods created :: init default values :: mongo')
    await initInfos()
    Logger.trace('infos created :: init default values :: mongo')
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
