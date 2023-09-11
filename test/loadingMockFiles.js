const { readdir } = require('fs').promises
const mocksDirectory = './test/mocks'

module.exports = async () => {
  const mocks = []
  
  const listFiles = await readdir(mocksDirectory)
  for (const [index, file] of listFiles.entries()) {
    const test = require(`./mocks/${file}`)

    mocks.push({ id: index + 1, ...test })
  }
  return mocks
}
