const foodController = require('../controllers/foodController')

module.exports = (api) => {
  api.get('/food', foodController.getAll)

  api.get('/food/:food_id', foodController.getFood)

  api.post('/food', foodController.create)

  api.put('/food/:food_id', foodController.modify)

  api.delete('/food/:food_id', foodController.delete)

  return api
}
