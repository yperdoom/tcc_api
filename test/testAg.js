const agController = require('../algorithm/algorithmController')
const getAgParamsByEnv = require('../src/services/factory/getAgParamsByEnv')
const loadingMockFiles = require('./loadingMockFiles')
const Logger = require('../src/controllers/loggerController')
const { connect, closeConnect } = require('../config/database/mongo/mongoOperator')

const initTest = async () => {
  let testCount = 1
  let countOfTests = 30
  let params = getAgParamsByEnv()

  await connect()
  const mocks = await loadingMockFiles()

  // await test1(testCount, countOfTests, params, mocks)
  await test2(countOfTests, params, mocks)

  await closeConnect()
}

const test2 = async (countOfTests, params, mocks) => {
  const {
    bestFit,
    averageFits,
    averageBestFits,
    averageGenerations,
    tests
  } = await runTest(mocks, countOfTests, params)

  const objToSave = {
    bestFit,
    averageFits,
    averageBestFits,
    averageGenerations,
    tests,
    information: 'teste 17'
  }
  // await Logger.saveLog(objToSave, params)

  console.log('bestFit :: ', bestFit)
  console.log('averageFits :: ', averageFits)
  console.log('averageBestFits :: ', averageBestFits)
  console.log('averageGenerations :: ', averageGenerations)
  console.log('quantidade de testes feitos :: ', tests)

}

const test1 = async (testCount, countOfTests, params, mocks) => {
  // for (let evaluateCount = 0; evaluateCount < 2; evaluateCount++) {
  for (let crossoverCount = 0; crossoverCount < 4; crossoverCount++) {
    params.CROSSOVER_LEVEL = crossoverCount

    for (let mutationCount = 0; mutationCount < 4; mutationCount++) {
      params.MUTATION_LEVEL = mutationCount

      const {
        bestFit,
        averageFits,
        averageBestFits,
        averageGenerations,
        tests
      } = await runTest(mocks, countOfTests, params)

      const objToSave = {
        bestFit,
        averageFits,
        averageBestFits,
        averageGenerations,
        tests,
        information: `teste ${testCount}`
      }
      await Logger.saveLog(objToSave, params)

      testCount += 1

      console.log('bestFit :: ', bestFit)
      console.log('averageFits :: ', averageFits)
      console.log('averageBestFits :: ', averageBestFits)
      console.log('averageGenerations :: ', averageGenerations)
      console.log('quantidade de testes feitos :: ', tests)
    }
  }
  // }
}

const runTest = async (mocks, countOfTests, params) => {
  let bestFit = 1000
  let averageFits = 0
  let averageBestFits = 0
  let averageGenerations = 0
  let tic = '|'
  let restOfTic = '                    |'
  let tests = 0

  for (const mock of mocks) {
    for (let i = 0; i < countOfTests; i++) {
      const res = await agController(mock.foods, mock.meal, params)

      // console.log(res.log.bestFitness)
      averageFits += res.log.averageFitnessGeneration
      averageBestFits += res.log.bestFitness
      averageGenerations += res.log.countGeneration

      if (res.log.bestFitness < bestFit) {
        bestFit = res.log.bestFitness
      }
    }
    tests += countOfTests
    tic += '-'
    restOfTic = restOfTic.substr(1)
    console.log(tic + restOfTic)
  }

  averageFits = averageFits / (countOfTests * mocks.length)
  averageBestFits = averageBestFits / (countOfTests * mocks.length)
  averageGenerations = averageGenerations / (countOfTests * mocks.length)

  return {
    bestFit,
    averageFits,
    averageBestFits,
    averageGenerations,
    tests
  }
}

initTest()
