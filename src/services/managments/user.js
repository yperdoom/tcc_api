const mongoOperator = require('../../../config/database/mongo/mongoOperator')
const model = 'user'

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

  initAdminUser: async () => {
    const user = require('../../../pre_save/adminUser.json')
    const password = require('../../../config/auth/functions/password')
    user.password = await password.hashPassword(user.password)
    await mongoOperator.new(model, user)
  }
})