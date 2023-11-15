const foodController = require('./foodController')

module.exports = (api) => {
  api.get('/foods', foodController.getAll)

  api.get('/food/:food_id', foodController.getFood)

  api.post('/food', foodController.create)

  api.put('/food/:food_id', foodController.modify)

  api.delete('/food/:food_id', foodController.delete)

  return api
}
