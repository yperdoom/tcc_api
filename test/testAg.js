const agController = require('../algorithm/algorithmController')
const getAgParamsByEnv = require('../src/services/factory/getAgParamsByEnv')
const loadingMockFiles = require('./loadingMockFiles')
const generateNewEnvs = require('./generateNewEnvs')
const params = getAgParamsByEnv()
const Logger = require('../src/controllers/loggerController')
const { connect, closeConnect } = require('../config/database/mongo/mongoOperator')


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
  console.log('param ::', paramsToUpdated[5].toString())
  let env = await generateNewEnvs()
  const mocks = await loadingMockFiles()

  let bestFit = 1000
  let bestFitGeneration = null
  let param = null

  await connect()

  for (let count = 0; count < 20; count++) {
    for (const mock of mocks) {
      const res = await agController(mock.foods, mock.meal, env)

      // console.log(res.log)
      await Logger.saveLog(res.log, res.params)

      if (res.bestFitness < bestFit) {
        bestFit = res.bestFitness
        bestFitGeneration = res.countGeneration
        param = env[paramsToUpdated[5]]
      }
    }

    env = await generateNewEnvs(env, paramsToUpdated[5].toString())
  }

  await closeConnect()

  console.log('best fit :: ', bestFit)
  console.log('best fit generation :: ', bestFitGeneration)
  console.log('param :: ', param)
}

const initTest2 = async () => {
  await connect()
  const mocks = await loadingMockFiles()
  // console.log(mocks)
  const res = await agController(mocks[15].foods, mocks[15].meal, params)

  await Logger.saveLog(res.log, res.params)
  console.log('best :: ', res.log.bestFitness)
  console.log('params :: ', res.params)

  await closeConnect()

}

initTest2()
