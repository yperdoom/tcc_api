const mongo = require('./mongoConnection')
const mng = require('./mongooseRedirect')

module.exports = ({
  get: async (model, filter, projection, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].find(filter).select(projection).lean()
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  getOne: async (model, filter, projection, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].findOne(filter).select(projection).lean()
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  getAll: async (model, projection, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].find().select(projection).lean()
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  new: async (model, document, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].create(document)
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  put: async (model, filter, document, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].updateOne(filter, { $set: document })
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  delete: async (model, filter, isHaveConection) => {
    if (!isHaveConection) { await mongo.connect() }
    const response = await mng[model].deleteOne(filter)
    if (!isHaveConection) { await mongo.disconnect() }
    return response
  },
  connect: async () => {
    await mongo.connect()
  },
  disconnect: async () => {
    await mongo.disconnect()
  }
})