const verifyFields = require('../services/factory/verifyFields')
const verifyPrescriptionFields = require('../services/factory/verifyPrescriptionFields')
const agController = require('./agController')

const getFood = require('../services/food/getFood')
const getClient = require('../services/client/getClient')
const managementPrescription = require('../services/prescription/managementPrescription')

module.exports.create = async (requisition, response, next) => {
  const { body, auth } = requisition

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
    ...body.prescription,
    ...body,
    token: auth,
    is_adapted_prescription: false
  }

  for (const mealIndex in payload.meals) {
    for (const foodId in payload.meals[mealIndex].foods) {
      const food = await getFood('food_id', payload.meals[mealIndex].foods[foodId])

      payload.meals[mealIndex].foods[foodId] = food[0]
    }
  }

  await managementPrescription.openConnection()

  const prescription = await managementPrescription.create(payload)

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
      ...prescription._doc
    }
  })
}

module.exports.adapter = async (requisition, response, next) => {
  const { body, auth } = requisition

  const fields = verifyFields(body, [
    'foods',
    'prescriptionId',
    'mealId',
    'name',
    'type',
    'userId'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  await managementPrescription.openConnection()

  const prescription = await managementPrescription.getOne({ _id: body.prescriptionId })

  let meal = {}
  prescription.meals.forEach(mealActual => {
    if (mealActual._id.toString() === body.mealId.toString()) {
      meal = mealActual
    }
  })

  if (!meal) {
    await managementPrescription.closeConnection()

    return response.send({
      success: false,
      message: 'Refeição não encontrada!'
    })
  }

  if (body.foods.length !== meal.food_amount) {
    await managementPrescription.closeConnection()

    return response.send({
      success: false,
      message: 'O número de alimentos não condiz com a receita!'
    })
  }

  const individual = await agController.newAdapter(meal.foods, meal)

  const nutrients = await _calculateNutrients({ quantity: individual.chromosome, foods: meal.foods })

  const payload = {
    meals: [
      {
        name: 'Refeição adaptada: ' + body.name,
        type: body.type,
        countGenerations: individual.generationCounter,
        foods: meal.foods,
        fitness: individual.fitness,
        ...nutrients,
        recommended_calorie: meal.recommended_calorie,
        recommended_carbohydrate: meal.recommended_carbohydrate,
        recommended_protein: meal.recommended_protein,
        recommended_lipid: meal.recommended_lipid,
        food_amount: meal.food_amount
      }
    ],
    name: 'Adaptação: ' + body.name,
    recommended_calorie: meal.recommended_calorie,
    recommended_carbohydrate: meal.recommended_carbohydrate,
    recommended_protein: meal.recommended_protein,
    recommended_lipid: meal.recommended_lipid,
    is_adapted_prescription: true,
    meal_amount: 1,
    token: auth,
    client_id: prescription.client_id,
    manager_id: prescription.manager_id
  }

  const prescriptionCreated = await managementPrescription.create(payload)

  await managementPrescription.closeConnection()

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
      ...prescriptionCreated._doc
    }
  })
}

module.exports.getByUser = async (requisition, response, next) => {
  const userId = requisition.params.user_id
  let search = null
  if (requisition.query) { search = requisition.query.search }

  const client = await getClient('user_id', userId)

  if (!client) {
    return response.send({
      success: false,
      message: 'Cliente não encontrado!'
    })
  }
  await managementPrescription.openConnection()

  const prescriptions = await managementPrescription.getAll({ client_id: client[0].client_id })

  await managementPrescription.closeConnection()

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
      count: prescriptions.length,
      prescriptions
    }
  })
}

module.exports.getOne = async (requisition, response, next) => {
  const prescriptionId = requisition.params.prescription_id

  await managementPrescription.openConnection()

  const prescriptions = await managementPrescription.getOne({ _id: prescriptionId })

  await managementPrescription.closeConnection()

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
