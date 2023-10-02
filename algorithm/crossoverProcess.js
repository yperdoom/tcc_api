module.exports = async (fatherChromosome, motherChromosome, params) => {
  if ((Math.floor(Math.random() * 100)) <= params.CROSSOVER_RATE) {
    const lengthOfChromosome = (fatherChromosome.chromosome.length + motherChromosome.chromosome.length) / 2
    const fatherSon = { ...fatherChromosome, selected: false }
    const motherSon = { ...motherChromosome, selected: false }
    let chromosomes = {}

    switch (params.CROSSOVER_LEVEL) {
      case 0:
        chromosomes = crossoverRandom(fatherSon, motherSon, lengthOfChromosome)
        break;
      case 1:
        chromosomes = crossover1Bit(fatherSon, motherSon, lengthOfChromosome)
        break;
      case 2:
        chromosomes = crossover2Bits(fatherSon, motherSon, lengthOfChromosome)
        break;
      case 3:
        chromosomes = crossoverRandom(fatherSon, motherSon, lengthOfChromosome)
        break;

      default:
        throw new Error('error level of crossover undefined')
    }
    return chromosomes
  }
}

const crossover1Bit = (fatherSon, motherSon, lengthOfChromosome) => {
  const fatherBuffer = []
  const motherBuffer = []

  fatherBuffer.push(...fatherSon.chromosome)
  motherBuffer.push(...motherSon.chromosome)

  motherSon.chromosome[lengthOfChromosome - 1] = fatherBuffer[lengthOfChromosome - 1]
  fatherSon.chromosome[lengthOfChromosome - 1] = motherBuffer[lengthOfChromosome - 1]

  return {
    fatherSon,
    motherSon
  }
}

const crossover2Bits = (fatherSon, motherSon, lengthOfChromosome) => {
  const fatherBuffer = []
  const motherBuffer = []

  fatherBuffer.push(...fatherSon.chromosome)
  motherBuffer.push(...motherSon.chromosome)

  let cutoff = lengthOfChromosome - 2
  motherSon.chromosome[cutoff] = fatherBuffer[cutoff]
  fatherSon.chromosome[cutoff] = motherBuffer[cutoff]

  cutoff = + 1
  motherSon.chromosome[cutoff] = fatherBuffer[cutoff]
  fatherSon.chromosome[cutoff] = motherBuffer[cutoff]

  return {
    fatherSon,
    motherSon
  }
}

const crossoverRandom = (fatherSon, motherSon, lengthOfChromosome) => {
  const fatherBuffer = []
  const motherBuffer = []

  fatherBuffer.push(...fatherSon.chromosome)
  motherBuffer.push(...motherSon.chromosome)

  const cutoff = Math.floor(Math.random() * lengthOfChromosome)

  for (let i = cutoff; i < lengthOfChromosome; i++) {
    motherSon.chromosome[i] = fatherBuffer[i]
    fatherSon.chromosome[i] = motherBuffer[i]
  }

  return {
    fatherSon,
    motherSon
  }
}