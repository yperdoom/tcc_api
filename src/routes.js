
const api = require('../config/apiConfiguration')

// import controllers and auth
const { authentication } = require('../config/auth/authentication')
const apiController = require('./controllers/apiController')
const userController = require('./controllers/userController')

api.get('/init', apiController.init)
api.post('/login', userController.login)

api.all('/*', authentication)

api.get('/ping', apiController.ping)
api.get('/status', apiController.status)
api.get('/user/:user_id', userController.getUser)
api.get('/user', userController.getAll)
api.post('/user', userController.create)
api.put('/user/:user_id', userController.modify)
api.delete('/user/:user_id', userController.delete)

module.exports = api