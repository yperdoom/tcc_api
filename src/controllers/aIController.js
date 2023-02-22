const prepareQuantityFood = require('../services/food/prepareQuantityFood')
const generateGeneration = require('../services/geneticAlgorithm/generateGeneration')
const evaluateGeneration = require('../services/geneticAlgorithm/evaluateGeneration')

module.exports.newAdapter = async (foods) => {
  let stopLoop = false

  let chromosome = null
  const preparedFoods = prepareQuantityFood(foods)
  const generation = generateGeneration(preparedFoods)
  const evaluatedGeneration = evaluateGeneration(preparedFoods, generation)

  if (evaluatedGeneration.success) {
    chromosome = evaluatedGeneration.evaluation
    stopLoop = true
  }

  while (stopLoop === false) {
    // mutar geração

    const evaluatedGeneration = evaluateGeneration(preparedFoods, generation)
    if (evaluatedGeneration.success) {
      chromosome = evaluatedGeneration.evaluation
      stopLoop = true
    }
  }

  return chromosome
}
