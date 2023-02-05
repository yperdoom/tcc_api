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

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const food = await createFood(body)

  if (!food) {
    return response.send({
      sucess: false,
      message: "it's not's possible to create a food account"
    })
  }

  return response.send({
    sucess: true,
    message: 'food created',
    body: food
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

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const food = await modifyFood(foodId, body)

  if (!food) {
    return response.send({
      sucess: false,
      message: "it's not's possible to modify a user"
    })
  }

  return response.send({
    sucess: true,
    message: 'food modified',
    body: food
  })
}

module.exports.delete = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  const food = await deleteFood(foodId)

  if (!food) {
    return response.send({
      sucess: false,
      message: "it's not's possible to delete a food"
    })
  }

  response.send({
    sucess: true,
    message: 'food deleted'
  })
}

module.exports.getFood = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  const food = await getFood('food_id', foodId)

  if (!food) {
    return response.send({
      sucess: false,
      message: 'food not found'
    })
  }

  response.send({
    sucess: true,
    message: 'food founded',
    body: food
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const foods = await getAllFoods()

  if (!foods) {
    return response.send({
      sucess: false,
      message: 'foods not found'
    })
  }

  return response.send({
    sucess: true,
    message: 'foods located',
    body: {
      count_foods_found: foods.length,
      foods_found: foods
    }
  })
}
