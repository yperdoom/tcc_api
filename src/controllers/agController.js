require('dotenv/config')
const {
  MAX_GENERATIONS,
  SIZE_GENERATION,
  MAX_CHROMOSOME_SIZE,
  EXPECTED_EVALUATION,
  CROSSOVER_RATE,
  MUTATION_RATE
} = process.env

const prepareQuantityFood = require('../services/food/prepareQuantityFood')
const generateGeneration = require('../services/geneticAlgorithm/generateGeneration')
const evaluateGeneration = require('../services/geneticAlgorithm/evaluateGeneration')
const sortGeneration = require('../services/geneticAlgorithm/sortGeneration')
const setRouletteRange = require('../services/geneticAlgorithm/setRouletteRange')
const russianRoulette = require('../services/geneticAlgorithm/russianRoulette')
const crossoverProcess = require('../services/geneticAlgorithm/crossoverProcess')
const mutateChromosome = require('../services/geneticAlgorithm/mutateChromosome')
const Logger = require('./loggerController')
const prepareToSaveParamsInLog = require('../services/factory/prepareToSaveParamsInLog')

module.exports.newAdapter = async (foods, meal) => {
  const parameters = prepareToSaveParamsInLog({ MAX_GENERATIONS, MAX_CHROMOSOME_SIZE, MUTATION_RATE, CROSSOVER_RATE, SIZE_GENERATION, EXPECTED_EVALUATION })
  let stopLoop = false
  let individual = null
  let bestIndividual = null
  let averageFitnessGeneration = null

  const preparedFoods = await prepareQuantityFood(foods)
  const generation = await generateGeneration(preparedFoods)
  let evaluated = await evaluateGeneration(preparedFoods, generation, meal)

  if (evaluated.individual) {
    individual = evaluated.individual
    stopLoop = true
  }

  averageFitnessGeneration = evaluated.averageFitnessGeneration
  bestIndividual = evaluated.bestChromosome

  let generationCounter = 1
  while (stopLoop === false && generationCounter <= MAX_GENERATIONS) {
    generationCounter += 1

    const sortedGeneration = await sortGeneration(evaluated.generation)
    const rouledGeneration = await setRouletteRange(sortedGeneration)
    const newGeneration = []

    while (newGeneration.length < SIZE_GENERATION) {
      const fatherGeneration = await russianRoulette(rouledGeneration, true)
      const mother = await russianRoulette(fatherGeneration.generation)

      const sons = await crossoverProcess(fatherGeneration.chromosome, mother)

      if (newGeneration.length > SIZE_GENERATION) break
      newGeneration.push(await mutateChromosome(sons.fatherSon))

      if (newGeneration.length > SIZE_GENERATION) break
      newGeneration.push(await mutateChromosome(sons.motherSon))
    }

    evaluated = await evaluateGeneration(preparedFoods, newGeneration, meal)

    if (evaluated.individual) {
      individual = evaluated.individual
      stopLoop = true
      averageFitnessGeneration = evaluated.averageFitnessGeneration
    }

    if (evaluated.bestChromosome.fitness < bestIndividual.fitness) {
      bestIndividual = evaluated.bestChromosome
    }
  }
  await Logger.openConnectToSaveLogs()

  await Logger.saveLog({
    bestFitness: individual?.fitness ?? bestIndividual.fitness,
    great: individual,
    good: bestIndividual,
    averageFitnessGeneration,
    countGeneration: (generationCounter),
    foods,
    meal
  }, parameters)

  console.log('melhor: ', bestIndividual)
  console.log('excelente: ', individual)
  console.log(generationCounter)
  await Logger.closeConnection()

  return {
    ...individual ?? bestIndividual,
    generationCounter
  }
}
