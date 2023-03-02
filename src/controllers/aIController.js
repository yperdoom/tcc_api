const prepareQuantityFood = require('../services/food/prepareQuantityFood')
const generateGeneration = require('../services/geneticAlgorithm/generateGeneration')
const evaluateGeneration = require('../services/geneticAlgorithm/evaluateGeneration')

module.exports.newAdapter = async (foods) => {
  let stopLoop = false

  let individual = null
  const preparedFoods = prepareQuantityFood(foods)
  const generation = generateGeneration(preparedFoods)
  const evaluatedGeneration = evaluateGeneration(preparedFoods, generation)

  if (evaluatedGeneration.success) {
    individual = evaluatedGeneration.individual
    stopLoop = true
  }

  while (stopLoop === false) {
    // selecionar cromossomos da geração atual
    //   roleta russa
    //   seleção do mais apto

    // mutar cromossomos selecionados
    // gerar uma nova geração

    const evaluatedGeneration = evaluateGeneration(preparedFoods, generation)
    if (evaluatedGeneration.success) {
      individual = evaluatedGeneration.individual
      stopLoop = true
    }
  }

  return individual
}
