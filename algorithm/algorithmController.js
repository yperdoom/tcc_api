const prepareQuantityFood = require('../src/services/food/prepareQuantityFood')
const generateGeneration = require('./generateGeneration')
const evaluateGeneration = require('./evaluateGeneration')
const sortGeneration = require('./russian_roulette/sortGeneration')
const setRouletteRange = require('./russian_roulette/setRouletteRange')
const russianRoulette = require('./russianRoulette')
const crossoverProcess = require('./crossoverProcess')
const mutateChromosome = require('./mutation_functions/mutateChromosome')
const updateParams = require('./updateParams')
const remakeGeneration = require('./generate_functions/remakeGeneration')

module.exports = async (foods, meal, params) => {
  let stopLoop = false
  let individual = null
  let bestIndividual = null
  let averageFitnessGeneration = null
  let generationCounter = 1
  // const generationToSave = []

  const preparedFoods = await prepareQuantityFood(foods)
  const generation = await generateGeneration(preparedFoods, params)
  let evaluated = await evaluateGeneration(preparedFoods, generation, meal, generationCounter, params)

  if (evaluated.individual) {
    individual = evaluated.individual
    stopLoop = true
  }

  // generationToSave.push(evaluated.generationToSave)

  averageFitnessGeneration = evaluated.averageFitnessGeneration
  bestIndividual = { ...evaluated.bestChromosome, generation: 1 }

  while (stopLoop === false && generationCounter <= params.MAX_GENERATIONS) {
    generationCounter += 1

    params = await updateParams(params, generationCounter)

    let newGeneration = []
    const sortedGeneration = await sortGeneration(evaluated.generation, params)

    if (params.REMAKE_GENERATION) {
      delete params.REMAKE_GENERATION

      newGeneration = await remakeGeneration(sortedGeneration, params)
    } else {
      if (params.MUTATION_LEVEL >= 4) {
        const rouledGeneration = await setRouletteRange(sortedGeneration, params)

        while (newGeneration.length < params.SIZE_GENERATION) {
          const fatherGeneration = await russianRoulette(rouledGeneration, true)
          const mother = await russianRoulette(fatherGeneration.generation)

          const sons = await crossoverProcess(fatherGeneration.chromosome, mother, params)

          if (newGeneration.length >= params.SIZE_GENERATION) break
          newGeneration.push(await mutateChromosome(sons.fatherSon, params))

          if (newGeneration.length >= params.SIZE_GENERATION) break
          newGeneration.push(await mutateChromosome(sons.motherSon, params))
        }
      } else {
        const newGen2 = []
        for (let crom of sortedGeneration) {
          if (newGen2.length >= params.SIZE_GENERATION) break
          newGen2.push(crom)
        }

        for (let i = evaluated.generation.length - 1; newGeneration.length < params.SIZE_GENERATION; i--) {
          const sons = await crossoverProcess(newGen2[i], newGen2[i - 1], params)

          if (newGeneration.length >= params.SIZE_GENERATION) break
          newGeneration.push(await mutateChromosome(sons.fatherSon, params))

          if (newGeneration.length >= params.SIZE_GENERATION) break
          newGeneration.push(await mutateChromosome(sons.motherSon, params))
        }
      }
    }

    evaluated = await evaluateGeneration(preparedFoods, newGeneration, meal, generationCounter, params)

    generationToSave.push(evaluated.generationToSave)

    if (evaluated.individual) {
      individual = evaluated.individual
      stopLoop = true
      averageFitnessGeneration = evaluated.averageFitnessGeneration
    }

    if (evaluated.bestChromosome.fitness < bestIndividual.fitness) {
      bestIndividual = { ...evaluated.bestChromosome, generation: generationCounter }
    }
  }

  const objToSave = {
    bestFitness: individual?.fitness ?? bestIndividual.fitness,
    great: individual,
    good: bestIndividual,
    goodGenerationOn: bestIndividual.bestGenerationOn,
    averageFitnessGeneration,
    countGeneration: (generationCounter),
    foods,
    meal,
    // generationToSave
  }

  // console.log('melhor: ', bestIndividual)
  // console.log('excelente: ', individual)
  // console.log(generationCounter)

  return {
    log: objToSave,
    params
  }
}
