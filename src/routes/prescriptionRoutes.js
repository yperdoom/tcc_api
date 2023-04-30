const prescriptionController = require('../controllers/prescriptionController')

module.exports = (api) => {
  // api.get('/prescription', prescriptionController.getAll)

  api.get('/prescription/:user_id', prescriptionController.getByUser)

  // api.get('/prescription/:prescription_id', prescriptionController.getprescription)

  api.post('/prescription', prescriptionController.create)

  api.post('/prescription/adapter', prescriptionController.adapter)

  // api.put('/prescription/:prescription_id', prescriptionController.modify)

  // api.delete('/prescription/:prescription_id', prescriptionController.delete)

  return api
}
