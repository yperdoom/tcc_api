
const userController = require('../controllers/userController')

module.exports = (api) => {
  api.get('/user/:user_id', userController.getUser)

  api.get('/user', userController.getAll)

  api.post('/user', userController.create)

  api.put('/user/:user_id', userController.modify)

  api.delete('/user/:user_id', userController.delete)

  return api
}
