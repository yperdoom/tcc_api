const verifyFields = require('../factory/verifyFields')
const Food = require('./foodService')

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

  const food = await Food.create(body)

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

  const food = await Food.update({ _id: foodId }, body)

  if (!food) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar este alimento!'
    })
  }

  return response.send({
    success: true,
    message: 'Alimento modificado.',
    body: food
  })
}

module.exports.delete = async (requisition, response, next) => {
  const foodId = requisition.params.food_id

  const food = await Food.delete({ _id: foodId })

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

  const food = await Food.getOne({ _id: foodId })

  if (!food) {
    return response.send({
      success: false,
      message: 'Alimento não encontrado!'
    })
  }

  response.send({
    success: true,
    message: 'Alimento encontrado.',
    body: food
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const params = requisition.query
  let query = {}

  if (params.find) {
    query = { description: { $regex: params.find } }
  }

  const foods = await Food.getAll(query)

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
