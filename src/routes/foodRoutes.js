const foodController = require('../controllers/foodController')

module.exports = (api) => {
  api.get('/food', foodController.getAll)

  api.get('/food:food_id', foodController.getFood)

  api.post('/food', foodController.create)

  api.put('/food', foodController.modify)

  api.delete('/food', foodController.delete)

  return api
}
