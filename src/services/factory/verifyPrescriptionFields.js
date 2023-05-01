
module.exports = (body, prescriptionFields, mealFields) => {
  for (const field of prescriptionFields) {
    if (!body[field]) {
      return {
        message: `Campo: "${field}", não encontrado!`,
        success: false
      }
    }
  }

  for (let iterator = 0; iterator > body.prescription.meal_amount; iterator++) {
    for (const field of mealFields) {
      if (!body.meal[iterator][field]) {
        return {
          message: `Campo: "meal.${field}", não encontrado!`,
          success: false
        }
      }
    }
  }

  return { success: true }
}
