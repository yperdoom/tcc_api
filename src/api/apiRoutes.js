const apiController = require('./apiController')

module.exports = (api) => {
  api.post('/token', apiController.createToken)

  return api
}
