const calculateFitness = require('./evaluate_functions/calculateFitness')
const getPercentageOfProteins = require('./evaluate_functions/getPercentageOfProteins')

// Função que irá avaliar a geração de cromossomos informada
module.exports = async (foods, generation, meal, params) => {
  let averageFitnessGeneration = 0
  let chromosomeExcellent = null
  let bestChromosome = { fitness: 100 }

  // Percorre a geração iterando por cada cromossomo presente nela
  generation.forEach((individual) => {
    const sumOfNutrients = getPercentageOfProteins(foods, individual)

    const { fitness, divisionOfProteins } = calculateFitness(sumOfNutrients, meal)
    individual.fitness = fitness

    averageFitnessGeneration += individual.fitness

    if (Math.abs(individual.fitness) <= bestChromosome.fitness) {
      bestChromosome = {
        chromosome: individual.chromosome,
        fitness: individual.fitness,
        rouletteRange: individual.rouletteRange,
        divisionOfProteins,
        sumOfNutrients
      }
    }

    if (Math.abs(individual.fitness) <= params.EXPECTED_EVALUATION) {
      chromosomeExcellent = {
        chromosome: individual.chromosome,
        fitness: individual.fitness,
        rouletteRange: individual.rouletteRange,
        divisionOfProteins,
        sumOfNutrients
      }
    }

    return individual
  })

  averageFitnessGeneration = averageFitnessGeneration / params.SIZE_GENERATION

  return {
    generation,
    individual: chromosomeExcellent,
    bestChromosome,
    averageFitnessGeneration
  }
}
