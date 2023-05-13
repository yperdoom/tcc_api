const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (field, value) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `SELECT * FROM clients WHERE ${field} = $1`,
      values: [value]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-get-client-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
