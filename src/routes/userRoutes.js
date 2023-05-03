
const userController = require('../controllers/userController')

module.exports = (api) => {
  api.get('/user/clients', userController.getAllClients)

  api.get('/user/managers', userController.getAllManagers)

  api.get('/user/client/:user_id', userController.getClient)

  api.get('/user/manager/:user_id', userController.getManager)

  api.post('/user/client', userController.createClient)

  api.post('/user/manager', userController.createManager)

  api.put('/user/client/:user_id', userController.modifyClient)

  api.put('/user/manager/:user_id', userController.modifyManager)
  
  api.delete('/user/:user_id', userController.delete)

  return api
}
