
const verifyFields = require('../services/factory/verifyFields')
const verifyPrescriptionFields = require('../services/factory/verifyPrescriptionFields')
const getTimeNow = require('../services/factory/getTimeNow')

const createPrescription = require('../services/prescription/createPrescription')

const createMeal = require('../services/meal/createMeal')
const createPrescriptionMealSync = require('../services/syncTables/createPrescriptionMealSync')
const createMealFoodSync = require('../services/syncTables/createMealFoodSync')

const agController = require('./agController')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyPrescriptionFields(body, [
    'prescription.name',
    'prescription.recommended_calorie',
    'prescription.recommended_protein',
    'prescription.recommended_lipid',
    'prescription.recommended_carbohydrate',
    'prescription.meal_amount',
    'prescription.client_id',
    'prescription.manager_id'
  ], [
    'name',
    'type',
    'recommended_calorie',
    'calorie',
    'recommended_protein',
    'protein',
    'recommended_lipid',
    'lipid',
    'recommended_carbohydrate',
    'carbohydrate',
    'food_multiplier'
  ])

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const prescription = await createPrescription(body.prescription)

  for (let iterator = 0; iterator > body.prescription.meal_amount; iterator++) {
    const meal = await createMeal(body.meal[iterator])
    await createPrescriptionMealSync(prescription._prescription_id, meal.meal_id)

    for (let iterator = 0; iterator > body.meal.food_amount; iterator++) {
      await createMealFoodSync(meal.meal_id, body.meal.foods[iterator].food_id)
    }
  }

  if (!prescription) {
    return response.send({
      sucess: false,
      message: "it's not's possible to prescribe"
    })
  }

  return response.send({
    sucess: true,
    message: 'prescription created',
    body: prescription
  })
}

module.exports.adapter = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, ['foods'])

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const prescription = agController.newAdapter(body.foods)

  if (!prescription) {
    return response.send({
      sucess: false,
      message: "it's not's possible to adapter prescribe"
    })
  }

  return response.send({
    sucess: true,
    message: 'prescription adapted',
    body: prescription
  })
}
