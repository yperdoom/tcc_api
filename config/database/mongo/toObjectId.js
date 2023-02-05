
const mongoose = require('mongoose')

const _isObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id)
}

module.exports = (id) => {
  if (_isObjectId(id)) {
    return mongoose.Types.ObjectId(String(id))
  }
}
