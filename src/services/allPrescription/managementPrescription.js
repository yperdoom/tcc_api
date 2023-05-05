const Prescription = require('../../../config/database/mongo/models/Prescriptions')
const mongoConnection = require('../../../config/database/mongo/mongoConnection')

module.exports = ({
  create: async (document) => {
    return await Prescription.create(document)
  },
  modify: async (prescriptionId, payload) => {
    const filter = {
      _id: prescriptionId
    }

    const query = {
      $set: payload
    }

    return await Prescription.findOneAndUpdate(filter, query).lean()
  },
  delete: async (prescriptionId) => {
    const filter = {
      _id: prescriptionId
    }

    return await Prescription.deleteOne(filter)
  },

  getOne: async (filter) => {
    return await Prescription.findOne(filter).lean()
  },
  getAll: async (filter) => {
    return await Prescription.find(filter).lean()
  },
  getMany: async () => {
    return await Prescription.find().lean()
  },

  openConnection: async () => {
    await mongoConnection.connect()
  },
  closeConnection: async () => {
    await mongoConnection.disconnect()
  }
})
