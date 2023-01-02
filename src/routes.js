
const api = require('../config/apiConfiguration')

// import controllers and auth
const { authentication } = require('../config/auth/authentication')
const apiController = require('./controllers/apiController')
const loginController = require('./controllers/loginController')

api.post('/login', loginController.login)

api.all('/*', authentication)

api.get('/ping', apiController.ping)
api.get('/status', apiController.status)

module.exports = api