const mongo = require('./mongoConnection')
const mng = require('./mongooseRedirect')

module.exports = ({
  get: async (model, filter) => { },
  getOne: async (model, filter) => { },
  getAll: async (model) => { },
  new: async (model, document) => {
    // await mongo.connect()
    // const response = await mng[model].create(document)
    // await mongo.disconnect()
    // return responsse
  },
  put: async (model, filter, document) => { },
  delete: async (model, filter) => { },
})