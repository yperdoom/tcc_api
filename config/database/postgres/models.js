const Logger = require('../../../src/controllers/loggerController')

const User = require('./models/User')
const Manager = require('./models/Manager')
const Client = require('./models/Client')
const Food = require('./models/Food')
const Meal = require('./models/Meal')
const MealFood = require('./models/MealFood')
const Prescription = require('./models/Prescription')
const PrescriptionMeal = require('./models/PrescriptionMeal')
const initAdminUser = require('../../../src/services/user/initAdminUser')

module.exports.init = async () => {
  const response = await _initTables()

  if (response.success) {
    Logger.log({ message: 'Tables inits with success' })
    return { success: true }
  }
  return response
}

const _initTables = async () => {
  const successObject = { success: true }

  try {
    await User.createTable()
    await Manager.createTable()
    await Client.createTable()
    await Food.createTable()
    await Meal.createTable()
    await MealFood.createTable()
    await Prescription.createTable()
    await PrescriptionMeal.createTable()
    await initAdminUser()
  } catch (error) {
    console.log(error)

    Logger.error({
      ...error,
      type: 'database-error',
      local: 'create-postgres-tables'
    })

    successObject.success = false
    successObject.message = error.message
    successObject.body = error
  }

  return successObject
}
