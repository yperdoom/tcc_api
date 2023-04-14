require('dotenv/config')
const { EXPECTED_EVALUATION, SIZE_GENERATION } = process.env

// Função que irá avaliar a geração de cromossomos informada
module.exports = (foods, generation, meal) => {
  let averageFitnessGeneration = 0
  let chromosomeExcellent = null

  // Percorre a geração iterando por cada cromossomo presente nela
  generation.forEach((individual) => {
    // Variável que será usada para a soma de porcentagens de calorias
    let calorieSum = 0
    let proteinSum = 0
    let carbohydrateSum = 0
    let lipidSum = 0

    // Percorre por todos os alimentos, iterando por cada um deles
    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      const percentage = (individual.chromosome[foodIterator] * 100) / foods[foodIterator].quantity

      calorieSum += foods[foodIterator].calorie * (percentage / 100)
      proteinSum += foods[foodIterator].protein * (percentage / 100)
      carbohydrateSum += foods[foodIterator].carbohydrate * (percentage / 100)
      lipidSum += foods[foodIterator].lipid * (percentage / 100)
    }
    const quantityCalorieMultiplier = (calorieSum * 100) / meal.recommended_calorie
    const quantityProteinMultiplier = (proteinSum * 100) / meal.recommended_protein
    const quantityCarbohydrateMultiplier = (carbohydrateSum * 100) / meal.recommended_carbohydrate
    const quantityLipidMultiplier = (lipidSum * 100) / meal.recommended_lipid

    console.log('calorie ::', quantityCalorieMultiplier)
    console.log('protein ::', quantityProteinMultiplier)
    console.log('carbohydrate ::', quantityCarbohydrateMultiplier)
    console.log('lipid ::', quantityLipidMultiplier)

    console.log(individual)

    individual.fitness = (Math.abs(quantityCalorieMultiplier - 100) + ((Math.abs(quantityProteinMultiplier - 100) + Math.abs(quantityCarbohydrateMultiplier - 100) + Math.abs(quantityLipidMultiplier - 100)) / 3)) / 2
    averageFitnessGeneration += individual.fitness
    // Verifica se o individuo bate com a avaliação que se espera
    if (Math.abs(individual.fitness) <= EXPECTED_EVALUATION) {
      chromosomeExcellent = individual
    }

    return individual
  })

  averageFitnessGeneration = averageFitnessGeneration / SIZE_GENERATION

  return {
    generation,
    individual: chromosomeExcellent,
    averageFitnessGeneration
  }
}
