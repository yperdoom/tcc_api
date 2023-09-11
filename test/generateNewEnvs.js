

module.exports = async (env, paramToUpdate) => {
  if (!env) {
    return getDefaultEnv()
  }

  env[paramToUpdate] += 5

  return env
}

const getDefaultEnv = () => {
  return {
    SIZE_GENERATION: 10,
    MAX_GENERATIONS: 10,
    MAX_GENERATE_CHROMOSOME_SIZE: 10,
    MAX_CHROMOSOME_SIZE: 10,
    EXPECTED_EVALUATION: 0,
    CROSSOVER_RATE: 0,
    MUTATION_RATE: 0
  }
}