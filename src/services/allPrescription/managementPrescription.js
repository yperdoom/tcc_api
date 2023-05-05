const Prescription = require('../../config/database/mongo/models/Prescription')
const mongoConnection = require('../../config/database/mongo/mongoConnection')

module.exports = ({
  create: async (document) => {
    const prescription = await Prescription.create(document)

    return prescription
  },
  modify: async (prescriptionId, payload) => {
    const filter = {
      _id: prescriptionId
    }

    const query = {
      $set: payload
    }

    return await Prescription.findOneAndUpdate(filter, query)
  },
  delete: async (prescriptionId) => {
    const filter = {
      _id: prescriptionId
    }

    return await Prescription.deleteOne(filter)
  },

  getOne: async (filter) => {
    return await Prescription.findOne(filter)
  },
  getAll: async (filter) => {
    return await Prescription.find(filter)
  },
  getMany: async () => {
    return await Prescription.find()
  },

  openConnection: async () => {
    await mongoConnection.connect()
  },
  closeConnection: async () => {
    await mongoConnection.disconnect()
  }
})
