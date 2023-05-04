
module.exports = async (generation, father = false) => {
  let chromosome = null

  while (chromosome == null) {
    chromosome = await _getChromosome(generation)
  }

  if (father) {
    return {
      generation,
      chromosome
    }
  }

  return chromosome
}

const _getChromosome = async (generation) => {
  let chromosome = null
  const drawNumber = await Math.random() * generation.lastPosition

  await generation.generation.map((individual) => {
    const min = individual.rouletteRange[0]
    const max = individual.rouletteRange[1]

    if (drawNumber >= min && drawNumber <= max) {
      if (!individual.selected) {
        chromosome = {
          ...individual,
          selected: true
        }
      }
    }

    return individual
  })

  return chromosome
}
