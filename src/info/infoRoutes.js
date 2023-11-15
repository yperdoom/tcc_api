const infoController = require('./infoController')

module.exports = (api) => {
  api.get('/infos', infoController.getAll)

  api.get('/info/:info_id', infoController.getInfo)

  api.post('/info', infoController.create)

  api.put('/info/:info_id', infoController.modify)

  api.delete('/info/:info_id', infoController.delete)

  return api
}
