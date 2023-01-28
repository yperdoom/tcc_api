/**
 * Initial file of API
 *
 * Arquives and configurations
 */

// import and init libraryes
require('dotenv/config')
const { PORT } = process.env

// import routes api
const api = require('./routes')

api.listen(PORT, () => {
  console.log(`Api rodando na porta: ${PORT}.`)
})
