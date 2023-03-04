require('dotenv/config')
const { MAX_CHROMOSOME_SIZE } = process.env

module.exports = (chromosome) => {
  const random = Math.floor(Math.random() * chromosome.length)

  chromosome[random] = Math.floor(Math.random() * MAX_CHROMOSOME_SIZE)

  return chromosome
}
