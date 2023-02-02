const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/api/getTimeNow')

const createFood = require('../services/food/createFood')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, ['name', 'email', 'password', 'phone', 'birthday'])

  if (!fields.sucess) {
    return response.send(fields)
  }

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const food = await createFood(body)

  if (!food) {
    return response.send({ sucess: false, message: "it's not's possible to create a food account" })
  }

  return response.send({ sucess: true, message: 'food created', body: food })
}
