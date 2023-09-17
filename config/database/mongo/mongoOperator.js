const mongo = require('./mongoConnection')
const mng = require('./mongooseRedirect')

module.exports = ({
  get: async (model, filter) => { },
  getOne: async (model, filter) => { },
  getAll: async (model) => { },
  new: async (model, document) => {
    const response = await mng[model].create(document)
    return response
  },
  put: async (model, filter, document) => { },
  delete: async (model, filter) => { },
  connect: async () => {
    await mongo.connect()
  },
  closeConnect: async () => {
    await mongo.disconnect()
  }
})