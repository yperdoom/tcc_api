
module.exports = (parameters) => {
  return {
    maxGenerations: parameters.MAX_GENERATIONS,
    maxChromosomeSize: parameters.MAX_CHROMOSOME_SIZE,
    mutationRate: parameters.MUTATION_RATE,
    crossoverRate: parameters.CROSSOVER_RATE,
    sizeGeneration: parameters.SIZE_GENERATION,
    expectedEvaluation: parameters.EXPECTED_EVALUATION
  }
}
