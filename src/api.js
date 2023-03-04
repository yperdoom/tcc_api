/**
 * Initial file of API
 *
 * Arquives and configurations
 */

// import and init libraryes
require('dotenv/config')
const { PORT } = process.env
const Logger = require('./controllers/loggerController')

// import routes api
const api = require('./routes')

api.listen(PORT, () => {
  Logger.log({ message: `Api rodando na porta: ${PORT}.` })
})
