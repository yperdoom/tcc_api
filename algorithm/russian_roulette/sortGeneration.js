module.exports = async (generation, params) => {
  let auxiliary = null
  for (let i = 0; i < params.SIZE_GENERATION; i++) {
    for (let j = 0; j < params.SIZE_GENERATION; j++) {
      if (generation[i].fitness > generation[j].fitness) {
        auxiliary = generation[i]
        generation[i] = generation[j]
        generation[j] = auxiliary
      }
    }
  }

  return generation
}
