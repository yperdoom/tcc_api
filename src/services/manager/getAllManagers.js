const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = 'SELECT * FROM managers'

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-get-all-managers-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
