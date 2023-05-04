
const verifyFields = require('../services/factory/verifyFields')
const verifyPrescriptionFields = require('../services/factory/verifyPrescriptionFields')
const getTimeNow = require('../services/factory/getTimeNow')

const createPrescription = require('../services/prescription/createPrescription')

const createMeal = require('../services/meal/createMeal')
const getMeal = require('../services/meal/getMeal')
const createPrescriptionMealSync = require('../services/syncTables/createPrescriptionMealSync')
const getPrescriptionMeal = require('../services/syncTables/getPrescriptionMeal')
const createMealFoodSync = require('../services/syncTables/createMealFoodSync')

const getFood = require('../services/food/getFood')

const getClient = require('../services/client/getClient')
const getPrescriptions = require('../services/prescription/getPrescriptions')
const agController = require('./agController')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyPrescriptionFields(body, [
    'name',
    'recommended_calorie',
    'recommended_protein',
    'recommended_lipid',
    'recommended_carbohydrate',
    'meal_amount',
    'client_id',
    'manager_id'
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
    'food_amount',
    'foods'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.prescription.created_at = getTimeNow()
  body.prescription.updated_at = getTimeNow()

  const prescription = await createPrescription(body.prescription)

  for (let iterator = 0; iterator < body.prescription.meal_amount; iterator++) {
    body.meal[iterator].created_at = body.prescription.created_at
    body.meal[iterator].updated_at = body.prescription.updated_at
    console.log(body.meal[iterator])

    const meal = await createMeal(body.meal[iterator])

    if (!meal) {
      return response.send({
        success: false,
        message: 'Não foi possível criar esta refeição!'
      })
    }
    await createPrescriptionMealSync(prescription[0].prescription_id, meal[0].meal_id)

    for (let iterator = 0; iterator < body.meal.food_amount; iterator++) {
      await createMealFoodSync(meal[0].meal_id, body.meal.foods[iterator].food_id)
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
    body: {
      ...prescription[0]
    }
  })
}

module.exports.adapter = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'foods',
    'meal',
    'name',
    'type',
    'client_id',
    'manager_id'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  const meal = await getMeal('meal_id', body.meal)

  if (!meal) {
    return response.send({
      success: false,
      message: 'Refeição não encontrada!'
    })
  }

  if (body.foods.length !== meal[0].food_amount) {
    return response.send({
      success: false,
      message: 'O número de alimentos não condiz com a receita!'
    })
  }

  const foods = []

  for (const foodId of body.foods) {
    const food = await getFood('food_id', foodId)
    if (!food) {
      return response.send({
        success: false,
        message: 'Alimento não encontrado!'
      })
    }
    foods.push(food[0])
  }

  const individual = await agController.newAdapter(foods, meal[0])

  const nutrients = await _calculateNutrients({ quantity: individual.chromosome, foods })

  const payload = {
    ...body,
    ...nutrients,
    foods: { foods },
    recommended_calorie: meal[0].recommended_calorie,
    recommended_protein: meal[0].recommended_protein,
    recommended_lipid: meal[0].recommended_lipid,
    recommended_carbohydrate: meal[0].recommended_carbohydrate,
    food_amount: meal[0].food_amount,
    meal_amount: 1,
    is_adapted_meal: 1,
    foods_multiplier: individual.chromosome,
    fitness: individual.fitness
    // created_at: getTimeNow(),
    // updated_at: getTimeNow(),
  }

  const prescriptionCreated = await createPrescription(payload)
  const mealCreated = await createMeal(payload)

  if (!prescriptionCreated || !mealCreated) {
    return response.send({
      success: false,
      message: 'Não foi possível adaptar esta prescrição!'
    })
  }

  return response.send({
    success: true,
    message: 'Prescrição adaptada.',
    body: {
      ...prescriptionCreated[0],
      meal: mealCreated[0]
    }
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

  const prescriptions = await getPrescriptions('client_id', client[0].client_id)

  if (!prescriptions) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  for (let i = 0; i < prescriptions.length; i++) {
    const prescriptionMeal = await getPrescriptionMeal('prescription_id', prescriptions[i].prescription_id)

    if (!prescriptionMeal) {
      continue
    }

    prescriptions[i].meals = []

    for (let j = 0; j < prescriptionMeal.length; j++) {
      const meal = await getMeal('meal_id', prescriptionMeal[j].meal_id)

      prescriptions[i].meals.push(meal)
    }
  }

  response.send({
    success: true,
    message: 'Prescrição(s) encontrada(s).',
    body: {
      prescriptions
    }
  })
}

module.exports.getAllUserMeals = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  const meals = []

  const client = await getClient('user_id', userId)

  if (!client) {
    return response.send({
      success: false,
      message: 'Cliente não encontrado!'
    })
  }

  const prescriptions = await getPrescriptions('client_id', client[0].client_id)

  if (!prescriptions) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  for (let i = 0; i < prescriptions.length; i++) {
    const prescriptionMeal = await getPrescriptionMeal('prescription_id', prescriptions[i].prescription_id)

    if (!prescriptionMeal) {
      continue
    }

    for (let j = 0; j < prescriptionMeal.length; j++) {
      const meal = await getMeal('meal_id', prescriptionMeal[j].meal_id)

      meals.push(meal)
    }
  }

  response.send({
    success: true,
    message: 'Prescrição(s) encontrada(s).',
    body: {
      meals
    }
  })
}

const _calculateNutrients = async (payload) => {
  let calorie = 0
  let protein = 0
  let lipid = 0
  let carbohydrate = 0

  payload.foods.forEach((food, index) => {
    const foodQuantity = food.weight || food.portion || food.mililiter
    const percentage = ((payload.quantity[index] * 100) / foodQuantity) / 100

    calorie += food.calorie * percentage
    protein += food.protein * percentage
    lipid += food.lipid * percentage
    carbohydrate += food.carbohydrate * percentage
  })

  return {
    calorie,
    protein,
    lipid,
    carbohydrate
  }
}
