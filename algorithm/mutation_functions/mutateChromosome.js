module.exports = async (chromosome, params) => {
  if ((Math.floor(Math.random() * 100)) <= params.MUTATION_RATE) {

    switch (params.MUTATION_LEVEL) {
      case 0:
        chromosome = mutationRandom(chromosome, params)
        break;
      case 1:
        chromosome = mutation1Bit(chromosome, params)
        break;
      case 2:
        chromosome = mutation2Bits(chromosome, params)
        break;
      case 3:
        chromosome = mutationRandom(chromosome, params)
        break;
      case 4:
        //swap
        break;

      default:
        throw new Error('error level of mutation undefined')
    }
  }

  return chromosome
}


const mutation1Bit = (chromosome, params) => {
  chromosome[chromosome.length - 1] = Math.floor(Math.random() * params.MAX_CHROMOSOME_SIZE)

  return chromosome
}

const mutation2Bits = (chromosome, params) => {
  chromosome[chromosome.length - 1] = Math.floor(Math.random() * params.MAX_CHROMOSOME_SIZE)
  chromosome[chromosome.length - 2] = Math.floor(Math.random() * params.MAX_CHROMOSOME_SIZE)

  return chromosome
}

const mutationRandom = (chromosome, params) => {
  const chromosomePosition = Math.floor(Math.random() * chromosome.length)

  chromosome[chromosomePosition] = Math.floor(Math.random() * params.MAX_CHROMOSOME_SIZE)

  return chromosome
}