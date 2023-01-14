
const api = require('../config/apiConfiguration')

// import controllers and auth
const { authentication } = require('../config/auth/authentication')
const apiController = require('./controllers/apiController')
const loginController = require('./controllers/loginController')
const userController = require('./controllers/userController')

api.get('/init', apiController.init)
api.post('/login', loginController.login)

api.all('/*', authentication)

api.get('/ping', apiController.ping)
api.get('/status', apiController.status)
api.post('/user', userController.create)
api.put('/user', userController.modify)
api.delete('/user', userController.delete)

module.exports = api