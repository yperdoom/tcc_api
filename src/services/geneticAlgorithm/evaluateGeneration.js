require('dotenv/config')
const { EXPECTED_EVALUATION } = process.env

// Função que irá avaliar a geração de cromossomos informada
module.exports = (foods, generation, prescription) => {
  // Percorre a geração iterando por cada cromossomo presente nela
  generation.forEach((individual) => {
    // Variável que será usada para a soma de porcentagens
    let percentageSum = 0
    // let calorieSum = 0

    // Percorre por todos os alimentos, iterando por cada um deles
    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      // TO-DO

      // calcular caloria com base no peso e depois somar as calorias de cada cromossomo e comparar a porcentagem de diferença como avaliação

      // example:
      // const percentage = (individual.chromosome[foodIterator] * 100) / foods[foodIterator].quantity
      // calorieSum += foods[foodIterator].calorie * percentage

      // Soma a diferença de porcentagem
      percentageSum += (individual.chromosome[foodIterator] * 100) / foods[foodIterator].quantity
    }
    // individual.fitness = (calorieSum * 100) / prescription.recommended_calorie

    // Adiciona a média de diferença em porcentagem ao indivíduo
    individual.fitness = (percentageSum / foods.length)

    // Verifica se o individuo bate com a avaliação que se espera
    if (Math.abs(individual.fitness) >= EXPECTED_EVALUATION) {
      return {
        success: true,
        individual
      }
    }
  })

  return {
    success: false,
    generation
  }
}
