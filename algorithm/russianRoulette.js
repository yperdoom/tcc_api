const getChromosome = require("./russian_roulette/getChromosome")

module.exports = async (generation, father = false) => {
  let chromosome = null

  while (chromosome == null) {
    chromosome = await getChromosome(generation)
  }

  if (father) {
    return {
      generation,
      chromosome
    }
  }

  return chromosome
}
