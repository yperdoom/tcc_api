/**
 * Initial file of API
 *
 * Arquives and configurations
 */

const Logger = require('./api/loggerController')
Logger.trace('start traced', 'start')

// import and init libraryes
require('dotenv/config')
const { PORT } = process.env

Logger.trace('importing routes and api...', 'init')
// import routes api
const api = require('./routes')

api.listen(PORT, () => {
  Logger.log({ message: `Api rodando na porta: ${PORT}.` })
})
