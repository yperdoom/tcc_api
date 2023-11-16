
module.exports = (body, prescriptionFields, mealFields) => {
  for (const field of prescriptionFields) {
    if (body[field] === undefined) {
      return {
        message: `Campo: "${field}", não encontrado!`,
        success: false
      }
    }
  }

  for (let iterator = 0; iterator < body.meal_amount; iterator++) {
    for (const field of mealFields) {
      if (body.meals[iterator][field] === undefined) {
        return {
          message: `Campo: "meals.${field}", não encontrado!`,
          success: false
        }
      }
    }
  }

  return { success: true }
}
