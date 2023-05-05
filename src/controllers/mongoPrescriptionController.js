
const verifyFields = require('../services/factory/verifyFields')
const verifyPrescriptionFields = require('../services/factory/verifyPrescriptionFields')
const agController = require('./agController')

const getFood = require('../services/food/getFood')
const getClient = require('../services/client/getClient')
const managementPrescription = require('../services/allPrescription/managementPrescription')

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
    'calorie',
    'carbohydrate',
    'protein',
    'lipid',
    'recommended_calorie',
    'recommended_carbohydrate',
    'recommended_protein',
    'recommended_lipid',
    'food_amount',
    'foods'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  const payload = {
    ...body,
    is_adapted_prescription: false
  }

  await payload.meals.map(async (meal) => {
    const foods = []

    for (const foodId of meal.foods) {
      const food = await getFood('food_id', foodId)
      if (!food) {
        return response.send({
          success: false,
          message: 'Alimento não encontrado!'
        })
      }
      foods.push(food[0])
    }

    return foods
  })

  await managementPrescription.openConnection()

  const prescription = managementPrescription.create(payload)

  await managementPrescription.closeConnection()

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
      ...prescription
    }
  })
}

module.exports.adapter = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'foods',
    'prescriptionId',
    'mealId',
    'name',
    'type',
    'client_id',
    'manager_id'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  const prescription = await managementPrescription.getOne(body.prescriptionId)
  const meal = prescription.meals.filter(meal => meal._id === body.mealId)

  if (!meal) {
    return response.send({
      success: false,
      message: 'Refeição não encontrada!'
    })
  }

  if (body.foods.length !== meal.food_amount) {
    return response.send({
      success: false,
      message: 'O número de alimentos não condiz com a receita!'
    })
  }

  const foods = []

  for (const foodId of meal.foods) {
    const food = await getFood('food_id', foodId)
    if (!food) {
      return response.send({
        success: false,
        message: 'Alimento não encontrado!'
      })
    }
    foods.push(food[0])
  }

  const individual = await agController.newAdapter(foods, meal)

  const nutrients = await _calculateNutrients({ quantity: individual.chromosome, foods })

  const payload = {
    meals: [
      {
        name: body.name,
        type: body.type,
        countGenerations: individual.generationCounter,
        foods,
        fitness: individual.fitness,
        ...nutrients,
        recommended_calorie: meal.recommended_calorie,
        recommended_carbohydrate: meal.recommended_carbohydrate,
        recommended_protein: meal.recommended_protein,
        recommended_lipid: meal.recommended_lipid,
        food_amount: meal.food_amount
      }
    ],
    name: body.name,
    recommended_calorie: meal.recommended_calorie,
    recommended_carbohydrate: meal.recommended_carbohydrate,
    recommended_protein: meal.recommended_protein,
    recommended_lipid: meal.recommended_lipid,
    is_adapted_prescription: true,
    meal_amount: 1,
    client_id: body.client_id,
    manager_id: body.manager_id
  }

  const prescriptionCreated = await managementPrescription.create(payload)

  if (!prescriptionCreated) {
    return response.send({
      success: false,
      message: 'Não foi possível adaptar esta prescrição!'
    })
  }

  return response.send({
    success: true,
    message: 'Prescrição adaptada.',
    body: {
      ...prescriptionCreated
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

  const prescriptions = await managementPrescription.getAll({ client_id: client[0].client_id })

  if (!prescriptions) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  response.send({
    success: true,
    message: 'Prescrição(s) encontrada(s).',
    body: {
      prescriptions
    }
  })
}

module.exports.getOne = async (requisition, response, next) => {
  const userId = requisition.params.user_id

  const client = await getClient('user_id', userId)

  if (!client) {
    return response.send({
      success: false,
      message: 'Cliente não encontrado!'
    })
  }

  const prescriptions = await managementPrescription.getOne({ client: client[0].client_id })

  if (!prescriptions) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  response.send({
    success: true,
    message: 'Prescrição(s) encontrada(s).',
    body: {
      prescriptions
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
