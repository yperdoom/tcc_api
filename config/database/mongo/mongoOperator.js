const Logger = require('../../../src/controllers/loggerController')
const mongo = require('./mongoConnection')
const mng = require('./mongooseRedirect')
const options = {
  new: true,
  lean: true
}

module.exports = ({
  get: async (model, filter, projection) => {
    await mongo.connect()
    const response = await mng[model].find(filter, {}, options).select(projection)
    return response
  },
  getOne: async (model, filter, projection) => {
    await mongo.connect()
    const response = await mng[model].findOne(filter, {}, options).select(projection)
    return response
  },
  getAll: async (model, projection) => {
    await mongo.connect()
    const response = await mng[model].find({}, {}, options).select(projection)
    return response
  },
  new: async (model, document) => {
    await mongo.connect()
    const response = await mng[model].create(document)
    return response
  },
  put: async (model, filter, document) => {
    await mongo.connect()
    const response = await mng[model].findOneAndUpdate(filter, { $set: document }, options)
    return response
  },
  delete: async (model, filter) => {
    await mongo.connect()
    const response = await mng[model].deleteOne(filter)
    return response
  },
  disconnect: async () => {
    // await mongo.disconnect()
    Logger.log({ message: 'UEPAAA' })
  }
})