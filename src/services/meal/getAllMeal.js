const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  let res = {}

  try {
    const query = 'SELECT * FROM foods'

    res = await client.query(query)
  } catch (error) {
    res.rows = null
    
    Logger.error({
      ...error,
      type:'database-error',
      local: 'postgre-get-all-meals-service'
    })
  }

  client.release()
  await database.close()

  return res.rows
}
