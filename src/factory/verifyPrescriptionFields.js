
module.exports = (body, prescriptionFields, mealFields) => {
  for (const field of prescriptionFields) {
    if (body[field] === undefined) {
      return {
        message: `Campo: "${field}", não encontrado!`,
        success: false
      }
    }
  }

  if (body.meal_amount !== body.meals.length) {
    return {
      message: 'Quantidade de refeições enviadas, não condizem com as esperadas!',
      success: false
    }
  }

  for (let iterator = 0; iterator < body.meal_amount; iterator++) {
    if (body.meals[iterator].food_amount !== body.meals[iterator].foods.length) {
      return {
        message: 'Quantidade de alimentos enviados, não condizem com os esperados!',
        success: false
      }
    }

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
