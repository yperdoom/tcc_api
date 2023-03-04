const Logger = require('../../../src/controllers/loggerController')

const User = require('./models/User')
const Manager = require('./models/Manager')
const Client = require('./models/Client')
const Food = require('./models/Food')
const Meal = require('./models/Meal')
const MealFood = require('./models/MealFood')
const Prescription = require('./models/Prescription')

module.exports.init = async () => {
  const response = await _initTables()

  if (response.sucess) {
    Logger.log({ message: 'Tables inits with success' })
    return { sucess: true }
  }
  return response
}

const _initTables = async () => {
  try {
    // todo adicionar as tabelas de relacionamentos
    await User.createTable()
    await Manager.createTable()
    await Client.createTable()
    await Food.createTable()
    await Meal.createTable()
    await MealFood.createTable()
    await Prescription.createTable()
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'create-postgres-tables'
    })

    return {
      sucess: false,
      message: error.message,
      body: error
    }
  }

  return {
    sucess: true
  }
}
