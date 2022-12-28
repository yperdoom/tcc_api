
const api = require('./config/apiConfiguration')

// import controllers and auth
const { authentication } = require('./config/auth/authentication')
const apiController = require('./controllers/apiController')



// api.post('/login', loginController.login)

api.all('/*', authentication)

api.get('/ping', apiController.ping)

// app.get('/wallet/balance', walletController.balance)
// app.post('/wallet/earnings', walletController.earnings)
// app.post('/wallet/spending', walletController.spending)

module.exports = api