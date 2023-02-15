const prescriptionController = require('../controllers/prescriptionController')

module.exports = (api) => {
  api.get('/prescription', prescriptionController.getAll)

  api.get('/prescription/:prescription_id', prescriptionController.getprescription)

  api.post('/prescription', prescriptionController.create)

  api.put('/prescription/:prescription_id', prescriptionController.modify)

  api.delete('/prescription/:prescription_id', prescriptionController.delete)

  return api
}
