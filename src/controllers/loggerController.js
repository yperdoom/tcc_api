const color = require('../services/factory/terminalColors')

module.exports = ({
  log: (log) => {
    const message = {}

    if (log.message) {
      message.message = log.message
    }

    if (log.type) {
      message.type = log.type
    }

    if (log.local) {
      message.local = log.local
    }

    if (log.body) {
      message.body = log.body
    }

    console.log(color.blue)
    console.log(message)
    console.log(color.reset)
  },
  error: (error) => {
    const message = {}

    if (error.message) {
      message.message = error.message
    }

    if (error.type) {
      message.type = error.type
    }

    if (error.local) {
      message.local = error.local
    }

    if (error.body) {
      message.body = error.body
    }

    if (error.data) {
      message.data = error.data
    }

    if (error.response) {
      message.response = error.response
    }

    console.log(color.red)
    console.log(message)
    console.log(color.reset)
  }
})
