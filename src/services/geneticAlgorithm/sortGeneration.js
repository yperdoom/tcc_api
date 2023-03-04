require('dotenv/config')
const { SIZE_GENERATION } = process.env

module.exports = (generation) => {
  let auxiliary = null
  for (let i = 0; i < SIZE_GENERATION; i++) {
    for (let j = 0; j < SIZE_GENERATION; j++) {
      if (generation[i].fitness > generation[j].fitness) {
        auxiliary = generation[i]
        generation[i] = generation[j]
        generation[j] = auxiliary
      }
    }
  }

  return {
    generation
  }
}
