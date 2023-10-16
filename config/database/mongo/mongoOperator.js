const mongo = require('./mongoConnection')
const mng = require('./mongooseRedirect')

module.exports = ({
  get: async (model, filter, projection) => {
    await mongo.connect()
    const response = await mng[model].find(filter).select(projection).lean()
    await mongo.disconnect()
    return response
  },
  getOne: async (model, filter, projection) => {
    await mongo.connect()
    const response = await mng[model].findOne(filter).select(projection).lean()
    await mongo.disconnect()
    return response
  },
  getAll: async (model, projection) => {
    await mongo.connect()
    const response = await mng[model].find().select(projection).lean()
    await mongo.disconnect()
    return response
  },
  new: async (model, document) => {
    await mongo.connect()
    const response = await mng[model].create(document)
    await mongo.disconnect()
    return response
  },
  put: async (model, filter, document) => {
    await mongo.connect()
    const response = await mng[model].updateOne(filter, { $set: document })
    await mongo.disconnect()
    return response
  },
  delete: async (model, filter) => {
    await mongo.connect()
    const response = await mng[model].deleteOne(filter)
    await mongo.disconnect()
    return response
  }
})