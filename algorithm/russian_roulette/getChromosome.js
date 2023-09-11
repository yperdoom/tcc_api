module.exports = async (generation) => {
  let chromosome = null
  const drawNumber = Math.random() * generation.lastPosition

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