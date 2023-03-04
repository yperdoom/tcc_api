require('dotenv/config')
const { EXPECTED_EVALUATION } = process.env

// Função que irá avaliar a geração de cromossomos informada
module.exports = (foods, generation, meal) => {
  let averageFitnessGeneration = 0

  // Percorre a geração iterando por cada cromossomo presente nela
  generation.forEach((individual) => {
    // Variável que será usada para a soma de porcentagens de calorias
    let calorieSum = 0

    // Percorre por todos os alimentos, iterando por cada um deles
    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      const percentage = (individual.chromosome[foodIterator] * 100) / foods[foodIterator].quantity

      calorieSum += foods[foodIterator].calorie * (percentage / 100)
    }
    individual.quantityMultiplier = (calorieSum * 100) / meal.recommended_calorie
    individual.fitness = Math.abs(individual.quantityMultiplier - 100)
    averageFitnessGeneration += individual.fitness
    // Verifica se o individuo bate com a avaliação que se espera
    if (Math.abs(individual.fitness) <= EXPECTED_EVALUATION) {
      return {
        success: true,
        individual,
        averageFitnessGeneration
      }
    }
  })

  return {
    success: false,
    generation,
    averageFitnessGeneration
  }
}
