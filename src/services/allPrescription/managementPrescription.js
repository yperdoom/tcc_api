const Prescription = require('../../../config/database/mongo/models/Prescriptions')
const mongoConnection = require('../../../config/database/mongo/mongoConnection')
const Logger = require('../../controllers/loggerController')
const mongoose = require('mongoose')

module.exports = ({
  create: async (document) => {
    try {
      return await Prescription.create(document)
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-create-prescription-service'
      })
    }
  },
  modify: async (prescriptionId, payload) => {
    const filter = {
      _id: prescriptionId
    }

    const query = {
      $set: payload
    }

    try {
      return await Prescription.findOneAndUpdate(filter, query).lean()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-modify-prescription-service'
      })
    }
  },
  delete: async (prescriptionId) => {
    const filter = {
      _id: prescriptionId
    }

    try {
      return await Prescription.deleteOne(filter)
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-delete-prescription-service'
      })
    }
  },

  getOne: async (filter) => {
    try {
      return await Prescription.findOne(filter).lean()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-get-one-prescription-on-filter-service'
      })
    }
  },
  getAll: async (filter, search = '') => {
    try {
      filter.$text = { name: search }
      return await Prescription.find(filter).sort({ created_at: -1 }).lean()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-get-all-prescriptions-on-filter-service'
      })
    }
  },
  getMany: async () => {
    try {
      return await Prescription.find().lean()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-get-all-prescriptions-service'
      })
    }
  },

  toObjectId: (token) => {
    if (!token) {
      return new mongoose.Types.ObjectId()
    }
    return mongoose.Types.ObjectId(String(token))
  },

  openConnection: async () => {
    try {
      await mongoConnection.connect()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-connect-service'
      })
    }
  },
  closeConnection: async () => {
    try {
      Logger.log({ message: 'vo disconecta nao ieieieieie', local: 'da sua mãe' })
      // await mongoConnection.disconnect()
    } catch (error) {
      Logger.error({
        error,
        type: 'database-error',
        local: 'mongo-disconnect-service'
      })
    }
  }
})
