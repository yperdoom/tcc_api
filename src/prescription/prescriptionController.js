const verifyFields = require('../factory/verifyFields')
const verifyPrescriptionFields = require('../factory/verifyPrescriptionFields')
const agController = require('../../algorithm/algorithmController')
const { get: getFood } = require('../food/foodService')
const { getOne: getClient } = require('../user/userService')
const Prescription = require('./prescriptionService')
const getAgParamsByEnv = require('../factory/getAgParamsByEnv')
const terminalColors = require('../factory/terminalColors')

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
    ...body,
    token: auth,
    is_adapted_prescription: false
  }

  for (let i = 0; i < payload.meals.length; i++) {
    const foods = await getFood({ _id: { $in: payload.meals[i].foods } }, '-created_at -updated_at')

    for (let j = 0; j < foods.length; j++) {
      foods[j]._id = foods[j]._id.toString()
    }

    payload.meals[i].foods = foods
  }

  const prescription = await Prescription.create(payload)

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

  const prescription = await Prescription.getOne({ _id: body.prescriptionId })

  let meal = {}
  prescription.meals.forEach(mealActual => {
    if (mealActual._id.toString() === body.mealId.toString()) {
      meal = mealActual
    }
  })

  if (!meal) {
    return response.send({
      success: false,
      message: 'Refeição não encontrada!'
    })
  }

  if (body.division) {
    meal.division = body.division
  }

  const foodsToSearch = []

  for (const food of body.foods) {
    const foodToSearch = {
      _id: food.toString()
    }

    foodsToSearch.push(foodToSearch)
  }

  const foods = await getFood({ $or: foodsToSearch })

  const params = getAgParamsByEnv()
  const individual = await agController(foods, meal, params)
  const { nutrients, qFoods } = await _calculateNutrients(individual.chromosome, foods)

  const payload = {
    meals: [
      {
        individual,
        name: 'Refeição adaptada: ' + body.name,
        type: body.type,
        countGenerations: individual.generationCounter,
        foods: qFoods,
        quantity: individual.chromosome,
        fitness: individual.fitness,
        ...nutrients,
        // recommended_calorie: meal.recommended_calorie,
        // recommended_carbohydrate: meal.recommended_carbohydrate,
        // recommended_protein: meal.recommended_protein,
        // recommended_lipid: meal.recommended_lipid,
        food_amount: meal.food_amount
      }
    ],
    name: 'Adaptação: ' + body.name,
    ...nutrients,
    // recommended_calorie: meal.recommended_calorie,
    // recommended_carbohydrate: meal.recommended_carbohydrate,
    // recommended_protein: meal.recommended_protein,
    // recommended_lipid: meal.recommended_lipid,
    is_adapted_prescription: true,
    meal_amount: 1,
    token: auth,
    client_id: prescription.client_id,
    manager_id: prescription.manager_id
  }

  const prescriptionCreated = await Prescription.create(payload)

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
  const params = requisition.params
  let query = { _id: params.user_id }

  if (params.find) {
    query.name = { $regex: params.find }
  }

  const client = await getClient(query)

  if (!client) {
    return response.send({
      success: false,
      message: 'Cliente não encontrado!'
    })
  }

  const prescriptions = await Prescription.get({ client_id: client._id })

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

  const prescription = await Prescription.getOne({ _id: prescriptionId })

  if (!prescription) {
    return response.send({
      success: false,
      message: 'Nenhuma prescrição encontrada!'
    })
  }

  response.send({
    success: true,
    message: 'Prescrição(s) encontrada(s).',
    body: {
      ...prescription
    }
  })
}

const _calculateNutrients = async (quantity, foods) => {
  let calorie = 0
  let protein = 0
  let lipid = 0
  let carbohydrate = 0
  let newFoods = []

  foods.forEach((food, index) => {
    const foodQuantityReference = food.quantity
    console.log('foodQuantityReference :: ', foodQuantityReference)
    const algorithmFoodQuantity = quantity[index]
    console.log('algorithmFoodQuantity :: ', algorithmFoodQuantity)
    const percentage = ((algorithmFoodQuantity * 100) / foodQuantityReference) / 100
    console.log('percentage :: ', percentage)

    console.log(terminalColors.cian, 'ANTES ::')
    console.log('calorie ::', food.calorie)
    console.log('carbohydrate ::', food.protein)
    console.log('protein ::', food.lipid)
    console.log('lipid ::', food.carbohydrate)

    console.log(terminalColors.red, 'DEPOIS ::')
    console.log('calorie ::', food.calorie * percentage)
    console.log('carbohydrate ::', food.protein * percentage)
    console.log('protein ::', food.lipid * percentage)
    console.log('lipid ::', food.carbohydrate * percentage)

    newFoods.push({ ...food, weight: algorithmFoodQuantity })
    calorie += food.calorie * percentage
    protein += food.protein * percentage
    lipid += food.lipid * percentage
    carbohydrate += food.carbohydrate * percentage
  })

  return {
    nutrients: {
      recommended_calorie: calorie,
      recommended_carbohydrate: carbohydrate,
      recommended_protein: protein,
      recommended_lipid: lipid
    },
    qFoods: newFoods
  }
}
