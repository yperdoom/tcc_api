const mongoOperator = require('../../../config/database/mongo/mongoOperator')

module.exports = ({
  create: async (document) => {
    await mongoOperator.new('user', document)
  },
  update: async (filter, document) => {
    return mongoOperator.put('user', filter, document)
  },
  getOne: async (filter, projection = '') => {
    return mongoOperator.getOne('user', filter, projection)
  },
  get: async (filter, projection = '') => {
    return mongoOperator.get('user', filter, projection)
  },
  initAdminUser: async () => {
    const user = require('../../../pre_save/adminUser.json')
    const password = require('../../../config/auth/functions/password')
    user.password = password.hashPassword(user.password)
    await mongoOperator.new('user', user)
  }
})