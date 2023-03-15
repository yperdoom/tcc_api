
module.exports = async (generation, father = false) => {
  let chromosome = null

  while (chromosome == null) {
    const drawNumber = Math.random() * generation.lastPosition

    generation.generation.forEach((individual) => {
      const min = individual.rouletteRange[0]
      const max = individual.rouletteRange[1]

      if (drawNumber >= min && drawNumber <= max) {
        individual.rouletteRange = [-1, -1]
        chromosome = individual
      }
      return individual
    })
  }

  if (father) {
    return {
      generation,
      chromosome
    }
  }

  return chromosome
}
