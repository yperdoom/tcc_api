require('dotenv/config')
const { SIZE_POPULATION } = process.env

module.exports = (foods, generation) => {
  const evaluation = []

  generation.forEach((chromosome, index) => {
    let percentageSum = 0

    for (let foodIterator = 0; foodIterator < Math.floor(SIZE_POPULATION); foodIterator++) {
      evaluation[index][foodIterator].diference = (chromosome[foodIterator] * 100) / foods[foodIterator].quantity

      percentageSum += evaluation[index][foodIterator].diference
    }

    const percentageOfChromosome = percentageSum / Math.floor(SIZE_POPULATION)

    if (Math.abs(percentageOfChromosome) >= 75) {
      return {
        success: true,
        chromosome,
        evaluation: evaluation[index]
      }
    }
  })

  return {
    success: false,
    evaluation
  }
}

// evaluation[foodIterator].lipid = (foods[foodIterator].lipid * evaluation[foodIterator].diference) / 100
// evaluation[foodIterator].protein = (foods[foodIterator].protein * evaluation[foodIterator].diference) / 100
// evaluation[foodIterator].carbohydrate = (foods[foodIterator].carbohydrate * evaluation[foodIterator].diference) / 100
