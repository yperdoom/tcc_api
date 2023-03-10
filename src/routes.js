let api = require('../config/apiConfiguration')

// import controllers and auth
const { authentication } = require('../config/auth/authentication')
const loginController = require('./controllers/loginController')

const { readdir } = require('fs').promises
const routesDirectory = './src/routes'

api.post('/login', loginController.login)
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
