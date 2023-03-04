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
  let generation = await generateGeneration(preparedFoods)
  generation = await evaluateGeneration(preparedFoods, generation, meal)

  if (generation.success) {
    individual = generation.individual
    stopLoop = true
  }

  while (stopLoop === false) {
    generation.generation = sortGeneration(generation.generation)
    generation.generation = setRouletteRange(generation.generation)
    const newGeneration = []

    for (let i = 0; i < generation.generation.length; i++) {
      const sons = crossoverProcess(russianRoulette(generation.generation), russianRoulette(generation.generation))

      newGeneration.push(mutateChromosome(sons.son1))
      newGeneration.push(mutateChromosome(sons.son2))
    }

    generation = newGeneration

    generation = evaluateGeneration(preparedFoods, generation, meal)
    if (generation.success) {
      individual = generation.individual
      stopLoop = true
    }
  }

  return individual
}
