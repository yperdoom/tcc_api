const userModel = require('./models/user')
const clientModel = require('./models/client')

module.exports.init = async () => {
  const user = await userModel.createTable()
  const client = await clientModel.createTable()

  console.log(user)
  console.log(client)

  return 'sim'
}
