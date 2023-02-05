
module.exports.log = (message, type, body, local) => {
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
}
