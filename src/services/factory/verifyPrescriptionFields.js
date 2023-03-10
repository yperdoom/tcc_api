
module.exports = (body, prescriptionFields, mealFields) => {
  for (const field of prescriptionFields) {
    if (!body[field]) {
      return {
        message: `field ${field} not found`,
        sucess: false
      }
    }
  }

  for (let iterator = 0; iterator > body.prescription.meal_amount; iterator++) {
    for (const field of mealFields) {
      if (!body.meal[iterator][field]) {
        return {
          message: `field ${field} not found`,
          sucess: false
        }
      }
    }
  }

  return { sucess: true }
}
