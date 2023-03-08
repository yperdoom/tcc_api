
module.exports = (generation) => {
  let chromosome = null

  while (chromosome != null) {
    const drawNumber = Math.floor(Math.random() * generation.sumOfPercentages)
    generation = generation.forEach((individual) => {
      if (drawNumber >= individual.rouletteRange[0] && drawNumber <= individual.rouletteRange[1]) {
        individual.rouletteRange = [-1, -1]

        chromosome = individual
      }
      return individual
    })
  }

  return {
    generation,
    chromosome
  }
}
