const users = require('./models/users')
const clients = require('./models/client')

module.exports.init = async () => {

  const res = await users.createTable()
  console.log(res)

  return res
}