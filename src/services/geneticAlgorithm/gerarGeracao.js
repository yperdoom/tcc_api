require('dotenv/config')
const { SIZE_POPULATION, MAX_CHROMOSOME_SIZE } = process.env

module.exports = (foods) => {
  const population = []

  for (let populationIterator = 0; populationIterator < Math.floor(SIZE_POPULATION); populationIterator++) {
    const chromosome = []

    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      const random = Math.floor(Math.random() * MAX_CHROMOSOME_SIZE)
      chromosome.push(random)
    }
    population.push(chromosome)
  }

  return population
}
