require('dotenv/config')
const { CROSSOVER_RATE } = process.env

module.exports = async (fatherChromosome, motherChromosome) => {
  const fatherBuffer = fatherChromosome.chromosome
  const motherBuffer = motherChromosome.chromosome
  const fatherOffspring = fatherChromosome
  const motherOffspring = motherChromosome
  const lengthOfChromosome = (fatherBuffer.length + motherBuffer.length) / 2

  if ((Math.floor(Math.random() * 100)) <= CROSSOVER_RATE) {
    const cutoff = Math.floor(Math.random() * lengthOfChromosome)

    console.log('father ', fatherOffspring)
    console.log('mother ', motherOffspring)
    console.log('cutoff', cutoff)
    console.log('length ', lengthOfChromosome)

    // for (let i = cutoff; i < lengthOfChromosome; i++) {
    //   fatherOffspring.chromosome[i] = motherBuffer[i]

    //   motherOffspring.chromosome[i] = fatherBuffer[i]
    // }
  }

  console.log('father son ', fatherOffspring)
  console.log('mother son ', motherOffspring)

  return {
    fatherSon: fatherOffspring,
    motherSon: motherOffspring
  }
}
