const mongoOperator = require('../../config/database/mongo/mongoOperator')
const verifyFields = require('../services/factory/verifyFields')

const Food = require('../services/managments/food')

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

  await mongoOperator.connect()
  const food = await Food.create(body)
  await mongoOperator.disconnect()

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

  await mongoOperator.connect()
  const food = await Food.update({ _id: foodId }, body)
  await mongoOperator.disconnect()

  if (!food) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este alimento!'
    })
  }

  return response.send({
    success: true,
    message: 'Alimento modificado.',
    body: food[0]
  })
}

module.exports.delete = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  await mongoOperator.connect()
  const food = await Food.delete({ _id: foodId })
  await mongoOperator.disconnect()

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

  await mongoOperator.connect()
  const food = await Food.getOne({ _id: foodId })
  await mongoOperator.disconnect()

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
  await mongoOperator.connect()
  const foods = await Food.getAll()
  await mongoOperator.disconnect()

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
      count: foods.length,
      foods
    }
  })
}
