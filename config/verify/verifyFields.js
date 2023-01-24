
module.exports = (body, fields) => {
  const response = {sucess: true}

  for (field of fields ) {
    if (!body[field]) {
      response.message = `${field} not found`
      response.sucess = false
    }
  }

  return response
}