const agController = require('../algorithm/algorithmController')
const getAgParamsByEnv = require('../src/services/factory/getAgParamsByEnv')
const loadingMockFiles = require('./loadingMockFiles')
const generateNewEnvs = require('./generateNewEnvs')
const params = getAgParamsByEnv()

const initTest = async () => {
  const paramsToUpdated = [
    'SIZE_GENERATION',
    'MAX_GENERATIONS',
    'MAX_GENERATE_CHROMOSOME_SIZE',
    'MAX_CHROMOSOME_SIZE',
    'EXPECTED_EVALUATION',
    'CROSSOVER_RATE',
    'MUTATION_RATE'
  ]
  let env = await generateNewEnvs()
  const mocks = await loadingMockFiles()

  let bestFit = 1000
  let bestFitGeneration = null
  let param = null

  for (let count = 0; count < 30; count++) {
    for (const mock of mocks) {
      const res = await agController(mock.foods, mock.meal, env)

      if (res.bestFitness < bestFit) {
        bestFit = res.bestFitness
        bestFitGeneration = res.countGeneration
        param = env[paramsToUpdated[3]]
      }
    }

    env = await generateNewEnvs(env, paramsToUpdated[3].toString())
  }

  console.log('best fit :: ', bestFit)
  console.log('best fit generation :: ', bestFitGeneration)
  console.log('param :: ', param)
}

initTest()
