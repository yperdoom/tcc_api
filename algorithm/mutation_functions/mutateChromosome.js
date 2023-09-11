module.exports = async (chromosome, params) => {
  if ((Math.floor(Math.random() * 100)) <= params.MUTATION_RATE) {
    const random = Math.floor(Math.random() * chromosome.length)

    chromosome[random] = Math.floor(Math.random() * params.MAX_CHROMOSOME_SIZE)
  }

  return chromosome
}
