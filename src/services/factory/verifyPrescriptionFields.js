
module.exports = (body, prescriptionFields, mealFields) => {
  for (const field of prescriptionFields) {
    if (body.prescription[field] === undefined) {
      return {
        message: `Campo: "${field}", não encontrado!`,
        success: false
      }
    }
  }

  if (body.prescription.meal_amount !== body.meal.length) {
    return {
      message: 'Quantidade de refeições enviadas, não condizem com as esperadas!',
      success: false
    }
  }

  for (let iterator = 0; iterator < body.prescription.meal_amount; iterator++) {
    if (body.meal[iterator].food_amount !== body.meal[iterator].foods.length) {
      return {
        message: 'Quantidade de alimentos enviados, não condizem com os esperados!',
        success: false
      }
    }

    for (const field of mealFields) {
      if (body.meal[iterator][field] === undefined) {
        return {
          message: `Campo: "meal.${field}", não encontrado!`,
          success: false
        }
      }
    }
  }

  return { success: true }
}
