
const { readdir } = require('fs').promises
const routesDirectory = './config/database'

module.exports.init = async () => {
  const loadingModelsFiles = async (files) => {
    if (!files) {
      files = []
    }

    const listFiles = await readdir(routesDirectory)
    for (const file of listFiles) {
      const fileImport = require(`./models/${file}`)
      await fileImport.createTable()
    }
    return listFiles
  }

  loadingModelsFiles()
  return 'sim'
}
