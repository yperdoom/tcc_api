
module.exports = (body, fields, orFields) => {
  const response = { sucess: true }

  for (const field of fields) {
    if (!body[field]) {
      response.message = `field ${field} not found`
      response.sucess = false
    }
  }
  if (orFields) {
    let orComparation = false

    for (const field of orFields) {
      if (body[field]) {
        orComparation = true
      }
    }

    if (!orComparation) {
      response.message = `none of the following fields: ${orFields} was found`
      response.sucess = false
    }
  }

  return response
}
