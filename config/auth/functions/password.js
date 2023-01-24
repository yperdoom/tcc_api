const bcrypt = require('bcrypt')
require('dotenv/config')
const { SALT } = process.env

module.exports.hashPassword = async (password) => {

  return await bcrypt.hash(password, Number(SALT))
}

module.exports.comparePassword = async (password, hashPassword) => {
  
  return await bcrypt.compare(password, hashPassword)
}