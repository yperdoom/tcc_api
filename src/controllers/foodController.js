const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/factory/getTimeNow')

const createFood = require('../services/food/createFood')
const modifyFood = require('../services/food/modifyFood')
const deleteFood = require('../services/food/deleteFood')
const getFood = require('../services/food/getFood')
const getAllFoods = require('../services/food/getAllFoods')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description',
    'type',
    'calorie',
    'protein',
    'lipid',
    'carbohydrate'
  ], [
    'weight',
    'portion',
    'mililiter'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const food = await createFood(body)

  if (!food) {
    return response.send({
      success: false,
      message: 'Não foi possível criar este alimento!'
    })
  }

  return response.send({
    success: true,
    message: 'Alimento criado.',
    body: food[0]
  })
}

module.exports.modify = async (requisition, response, next) => {
  const foodId = requisition.params.food_id
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description',
    'type',
    'calorie',
    'protein',
    'lipid',
    'carbohydrate'
  ], [
    'weight',
    'portion',
    'mililiter'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const food = await modifyFood(foodId, body)

  if (!food) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este alimento!'
    })
  }

  return response.send({
    success: true,
    message: 'Alimento deletado.',
    body: food[0]
  })
}

module.exports.delete = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  const food = await deleteFood(foodId)

  if (!food) {
    return response.send({
      success: false,
      message: 'Não foi possível deletar este alimento!'
    })
  }

  response.send({
    success: true,
    message: 'Alimento deletado.'
  })
}

module.exports.getFood = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  const food = await getFood('food_id', foodId)

  if (!food) {
    return response.send({
      success: false,
      message: 'Alimento não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Alimento encontrado.',
    body: food[0]
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const foods = await getAllFoods()

  if (!foods) {
    return response.send({
      success: false,
      message: 'Nenhum alimento encontrado!'
    })
  }

  return response.send({
    success: true,
    message: 'Alimento(s) encontrados.',
    body: {
      count_foods_found: foods.length,
      foods_found: foods
    }
  })
}
