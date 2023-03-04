
module.exports = (generation) => {
  const drawNumber = Math.floor(Math.random() * generation.sumOfPercentages)

  const individual = generation.forEach((individual) => {
    if (drawNumber >= individual.rouletteRange[0] && drawNumber <= individual.rouletteRange[1]) {
      return individual
    }
  })

  return individual
}
