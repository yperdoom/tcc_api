
module.exports = ({
  log: (message, type, body, local) => {
    const blue = '\u001b[34m'
    console.log(blue + 'log instance =|')

    if (message) {
      console.log(message)
    }

    if (type) {
      console.log(type)
    }

    if (body) {
      console.log(body)
    }

    if (local) {
      console.log(local)
    }

    const reset = '\u001b[0m'
    console.log(reset + 'end log instance =|')
  },
  error: (message, type, body, local) => {
    const red = '\u001b[31m'
    console.log(red + 'error instance =|')

    if (message) {
      console.log(message)
    }

    if (type) {
      console.log(type)
    }

    if (body) {
      console.log(body)
    }

    if (local) {
      console.log(local)
    }

    const reset = '\u001b[0m'
    console.log(reset + 'end error instance =|')
  }
})
