
const verifyFields = require('../services/factory/verifyFields')
const verifyPrescriptionFields = require('../services/factory/verifyPrescriptionFields')
const getTimeNow = require('../services/factory/getTimeNow')

const createPrescription = require('../services/prescription/createPrescription')

const createMeal = require('../services/meal/createMeal')
const getMeal = require('../services/meal/getMeal')
const createPrescriptionMealSync = require('../services/syncTables/createPrescriptionMealSync')
const getPrescriptionMeal = require('../services/syncTables/getPrescriptionMeal')
const createMealFoodSync = require('../services/syncTables/createMealFoodSync')

const getClient = require('../services/client/getClient')
const getPrescriptions = require('../services/prescription/getPrescriptions')
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

  if (!fields.success) {
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
      success: false,
      message: 'Não foi possível criar esta prescrição!'
    })
  }

  return response.send({
    success: true,
    message: 'Prescrição criada.',
    body: prescription
  })
}

module.exports.adapter = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, ['foods'])

  if (!fields.success) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const prescription = agController.newAdapter(body.foods)

  if (!prescription) {
    return response.send({
      success: false,
      message: 'Não foi possível adaptar esta prescrição!'
    })
  }

  return response.send({
    success: true,
    message: 'Prescrição adaptada.',
    body: prescription
  })
}

module.exports.getByUser = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const client = await getClient('user_id', userId)

  if (!client) {
    return response.send({
      success: false,
      message: 'Cliente não encontrado!'
    })
  }

  const prescriptions = await getPrescriptions('client_id', client.client_id)

  if (!prescriptions) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  for (let i = 0; i < prescriptions.length; i++) {
    const prescriptionMeal = await getPrescriptionMeal('prescription_id', prescriptions[i].prescription_id)

    const meal = await getMeal('meal_id', prescriptionMeal.meal_id)

    prescriptions.meal.push(meal)
  }

  response.send({
    success: true,
    message: 'Prescrição encontrada.',
    body: {
      prescriptions
    }
  })
}
