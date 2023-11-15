
module.exports = (body, fields, orFields) => {
  const response = { success: true }

  for (const field of fields) {
    if (body[field] === undefined || body[field] === null) {
      response.message = `Campo ${field} não encontrado`
      response.success = false
    }
  }
  if (orFields) {
    let orComparation = false

    for (const field of orFields) {
      if (body[field] !== undefined || body[field] === null) {
        orComparation = true
      }
    }

    if (!orComparation) {
      response.message = `Nenhum dos campos: ${orFields} foi encontrado`
      response.success = false
    }
  }

  return response
}
