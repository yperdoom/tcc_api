require('dotenv/config')
const { CROSSOVER_RATE } = process.env

module.exports = async (fatherChromosome, motherChromosome) => {
  const lengthOfChromosome = (fatherChromosome.chromosome.length + motherChromosome.chromosome.length) / 2
  const fatherOffspring = fatherChromosome
  const motherOffspring = motherChromosome
  const fatherBuffer = []
  const motherBuffer = []

  fatherBuffer.push(...fatherChromosome.chromosome)
  motherBuffer.push(...motherChromosome.chromosome)

  if ((Math.floor(Math.random() * 100)) <= CROSSOVER_RATE) {
    const cutoff = Math.floor(Math.random() * lengthOfChromosome)

    for (let i = cutoff; i < lengthOfChromosome; i++) {
      motherOffspring.chromosome[i] = fatherBuffer[i]
      fatherOffspring.chromosome[i] = motherBuffer[i]
    }
  }

  return {
    fatherSon: fatherOffspring,
    motherSon: motherOffspring
  }
}
