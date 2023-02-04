const { DateTime } = require('luxon')

module.exports = () => {
  return DateTime.now().setZone('America/Sao_Paulo')
}
