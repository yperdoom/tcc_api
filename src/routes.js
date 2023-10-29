let api = require('../config/apiConfiguration')

// import controllers and auth
const { authentication } = require('../config/auth/authentication')
const loginController = require('./controllers/loginController')
const apiController = require('./controllers/apiController')
const userController = require('./controllers/userController')

const { readdir } = require('fs').promises
const routesDirectory = './src/routes'

api.get('/init', apiController.init)
api.get('/ping', apiController.ping)
api.get('/status', apiController.status)

api.post('/login', loginController.login)
api.get('/user/managers', userController.getAllManagers)
api.all('/*', authentication)

const loadingRouteFiles = async (files) => {
  if (!files) {
    files = []
  }

  const listFiles = await readdir(routesDirectory)
  for (const file of listFiles) {
    const fileImport = require(`./routes/${file}`)
    api = fileImport(api)
  }
  return listFiles
}

loadingRouteFiles()

module.exports = api
