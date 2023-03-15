require('dotenv/config')
const { MAX_GENERATIONS, SIZE_GENERATION } = process.env

const prepareQuantityFood = require('../services/food/prepareQuantityFood')
const generateGeneration = require('../services/geneticAlgorithm/generateGeneration')
const evaluateGeneration = require('../services/geneticAlgorithm/evaluateGeneration')
const sortGeneration = require('../services/geneticAlgorithm/sortGeneration')
const setRouletteRange = require('../services/geneticAlgorithm/setRouletteRange')
const russianRoulette = require('../services/geneticAlgorithm/russianRoulette')
const crossoverProcess = require('../services/geneticAlgorithm/crossoverProcess')
const mutateChromosome = require('../services/geneticAlgorithm/mutateChromosome')

module.exports.newAdapter = async (foods, meal) => {
  let stopLoop = false

  let individual = null
  const preparedFoods = await prepareQuantityFood(foods)
  const generation = generateGeneration(preparedFoods)
  const evaluated = evaluateGeneration(preparedFoods, generation, meal)

  if (evaluated.individual) {
    individual = evaluated.individual
    stopLoop = true
  }

  let generationCounter = 0
  while (stopLoop === false && generationCounter <= MAX_GENERATIONS) {
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

    const newEvaluated = evaluateGeneration(preparedFoods, newGeneration, meal)
    if (newEvaluated.individual) {
      individual = newEvaluated.individual
      stopLoop = true
    }
    generationCounter += 1
  }

  console.log(individual)
  return individual
}
