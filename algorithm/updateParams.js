module.exports = async (params, generationCounter) => {

  if (generationCounter == parseInt(params.MAX_GENERATIONS / 8)) {
    params.MUTATION_LEVEL = 1
    params.CROSSOVER_LEVEL = 1
    // console.log('level updated to 1')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 6.5)) {
    params.MUTATION_LEVEL = 2
    params.CROSSOVER_LEVEL = 2
    // console.log('level updated to 2')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 3)) {
    params.MUTATION_LEVEL = 3
    params.CROSSOVER_LEVEL = 3
    // console.log('level updated to 3')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 2.5)) {
    params.MUTATION_LEVEL = 4
    params.CROSSOVER_LEVEL = 4
    // console.log('level updated to 4')
  }

  if (generationCounter == parseInt(params.MAX_GENERATIONS / 2)) {
    params.REMAKE_GENERATION = true
    // console.log('remake generation')
  }

  if (generationCounter == parseInt(params.MAX_GENERATIONS / 1.8)) {
    params.MUTATION_LEVEL = 0
    params.CROSSOVER_LEVEL = 0
    // console.log('level reset')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 1.6)) {
    params.MUTATION_LEVEL = 1
    params.CROSSOVER_LEVEL = 1
    // console.log('level updated to 1')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 1.4)) {
    params.MUTATION_LEVEL = 2
    params.CROSSOVER_LEVEL = 2
    // console.log('level updated to 2')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 1.3)) {
    params.MUTATION_LEVEL = 3
    params.CROSSOVER_LEVEL = 3
    // console.log('level updated to 3')
  }
  if (generationCounter == parseInt(params.MAX_GENERATIONS / 1.2)) {
    params.MUTATION_LEVEL = 4
    params.CROSSOVER_LEVEL = 4
    // console.log('level updated to 4')
  }

  return params
}
