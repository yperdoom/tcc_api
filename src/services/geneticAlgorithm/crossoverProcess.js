require('dotenv/config')
const { CROSSOVER_RATE } = process.env

module.exports = (fatherChromosome, motherChromosome) => {
  const fatherBuffer = fatherChromosome
  const motherBuffer = motherChromosome

  const sonChromosome = {
    fatherOffspring: fatherBuffer,
    motherOffspring: motherBuffer
  }

  if ((Math.floor(Math.random() * 100)) <= CROSSOVER_RATE) {
    const cutoff = Math.floor(Math.random() * fatherChromosome.length)
    for (let i = cutoff; i < fatherChromosome.length; i++) {
      sonChromosome.fatherOffspring[i] = motherBuffer[i]
      sonChromosome.motherOffspring[i] = fatherBuffer[i]
    }
  }

  return {
    son1: sonChromosome.fatherOffspring,
    son2: sonChromosome.motherOffspring
  }
}
