const { DateTime } = require('luxon')

module.exports = ({
  now: () => {
    return DateTime.now().setZone('America/Sao_Paulo')
  }
})
