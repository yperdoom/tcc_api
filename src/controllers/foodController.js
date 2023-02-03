const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/api/getTimeNow')

const createFood = require('../services/food/createFood')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'email',
    'password',
    'phone',
    'birthday'
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
  // const foodId = requisition.params.food_id
  const { body } = requisition

  const fields = { sucess: false } // verifyFields(body, ['name', 'password', 'phone', 'birthday'])

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.updated_at = getTimeNow()

  const food = 'sim' // criar service de atualizar alimento

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
  // const foodId = requisition.params.food_id

  const food = 'sim'// criar service para deletar alimento

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

module.exports.getUser = async (requisition, response, next) => {
  // const foodId = requisition.params.food_id

  const food = 'sim'// criar service para pegar alimento

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
  const foods = 'sim'// criar service para pegar todos os alimentos

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
