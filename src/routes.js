const Logger = require('./api/loggerController')
let api = require('../config/apiConfiguration')

// import and expose not auth routes
Logger.trace('initing api routes...', 'init')
const apiController = require('./api/apiController')
api.get('/init', apiController.init)
api.get('/ping', apiController.ping)
api.get('/status', apiController.status)

Logger.trace('initing login route...', 'init')
const loginController = require('./user/loginController')
api.post('/login', loginController.login)

Logger.trace('initing managemengt route...', 'init')
const userController = require('./user/userController')
api.get('/user/managers', userController.getAllManagers)


// add authentication layer
Logger.trace('initing authentication layer...', 'init')
const { authentication } = require('../config/auth/authentication')
api.all('/*', authentication)

// add auth routes
Logger.trace('initing routes...', 'init')
const { readdir } = require('fs').promises
const routesDirectory = './src'

const loadingRouteFiles = async (files) => {
  if (!files) {
    files = []
  }

  const listFiles = await readdir(routesDirectory)
  for (const folder of listFiles) {
    if (!folder.includes('.js')) {
      const folderFiles = await readdir(`${routesDirectory}/${folder}`)
      for (const file of folderFiles) {
        if (file.includes('Routes')) {
          const req = require(`./${folder}/${file}`)
          api = req(api)
          Logger.trace(`route file ${file} imported.`, 'init')
        }
      }
    }
  }
  return api
}

loadingRouteFiles()

module.exports = api
