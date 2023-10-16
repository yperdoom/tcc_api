const { addListener } = require('../config/database/mongo/models/GenerationLog')
const calculateFitness = require('./evaluate_functions/calculateFitness')
const getPercentageOfProteins = require('./evaluate_functions/getPercentageOfProteins')

// Função que irá avaliar a geração de cromossomos informada
module.exports = async (foods, generation, meal, generationCounter, params) => {
  let averageFitnessGeneration = 0
  let chromosomeExcellent = null
  let bestChromosome = { fitness: 100 }
  const newGeneration = []
  // const generationToSave = []

  // Percorre a geração iterando por cada cromossomo presente nela
  for (const individual of generation) {
    const sumOfNutrients = await getPercentageOfProteins(foods, individual)
    const { fitness, divisionOfProteins } = await calculateFitness(sumOfNutrients, meal)
    individual.fitness = fitness

    averageFitnessGeneration = averageFitnessGeneration + fitness

    if (Math.abs(individual.fitness) <= bestChromosome.fitness) {
      bestChromosome = {
        chromosome: individual.chromosome,
        fitness: individual.fitness,
        rouletteRange: individual.rouletteRange,
        divisionOfProteins,
        sumOfNutrients,
        bestGenerationOn: generationCounter
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

    // generationToSave.push(individual.fitness)
    newGeneration.push(individual)
  }

  averageFitnessGeneration = averageFitnessGeneration / params.SIZE_GENERATION

  return {
    generation: newGeneration,
    individual: chromosomeExcellent,
    bestChromosome,
    averageFitnessGeneration
    // generationToSave
  }
}
