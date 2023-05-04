require('dotenv/config')
const { MAX_CHROMOSOME_SIZE, MUTATION_RATE } = process.env

module.exports = async (chromosome) => {
  if ((Math.floor(Math.random() * 100)) <= MUTATION_RATE) {
    const random = Math.floor(Math.random() * chromosome.length)

    chromosome[random] = Math.floor(Math.random() * MAX_CHROMOSOME_SIZE)
  }

  return chromosome
}
