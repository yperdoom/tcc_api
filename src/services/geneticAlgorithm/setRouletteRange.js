require('dotenv/config')
const { SIZE_GENERATION } = process.env

module.exports = (generation) => {
  let sumOfPercentages = 0

  sumOfPercentages += generation[0].fitness
  generation[0].rouletteRange = [0, sumOfPercentages]

  for (let i = 1; i < (SIZE_GENERATION - 1); i++) {
    sumOfPercentages += generation[i].fitness
    generation[i].rouletteRange = [(sumOfPercentages - generation[i].fitness), sumOfPercentages]
  }

  sumOfPercentages += generation[0].fitness
  generation[0].rouletteRange = [(sumOfPercentages - generation[SIZE_GENERATION].fitness), sumOfPercentages]

  return { generation, sumOfPercentages }
}
