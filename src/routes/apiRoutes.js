const apiController = require('../controllers/apiController')

module.exports = (api) => {
  api.post('/token', apiController.createToken)

  return api
}
