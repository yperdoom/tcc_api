const mongoOperator = require('../../../config/database/mongo/mongoOperator')
const model = 'prescription'

module.exports = ({
  create: async (document) => {
    return mongoOperator.new(model, document)
  },
  update: async (filter, document) => {
    return mongoOperator.put(model, filter, document)
  },
  getOne: async (filter, projection = '') => {
    return mongoOperator.getOne(model, filter, projection)
  },
  get: async (filter, projection = '') => {
    return mongoOperator.get(model, filter, projection)
  },
  getAll: async () => {
    return mongoOperator.getAll(model)
  },
  delete: async (filter) => {
    return mongoOperator.delete(model, filter)
  },
})
