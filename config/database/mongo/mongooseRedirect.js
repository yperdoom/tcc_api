const Food = require('./models/Food')
const GenerationLog = require('./models/GenerationLog')
const Information = require('./models/Information')
const Prescription = require('./models/Prescription')
const User = require('./models/User')

module.exports = ({
  'food': Food,
  'genlog': GenerationLog,
  'info': Information,
  'prescription': Prescription,
  'user': User,
})