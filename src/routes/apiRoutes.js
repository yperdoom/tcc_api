const apiController = require('../controllers/apiController')

module.exports = (api) => {
  api.get('/init', apiController.init)

  api.get('/ping', apiController.ping)

  api.get('/status', apiController.status)

  return api
}
