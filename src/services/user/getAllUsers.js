const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  let res = {}

  try {
    const query = 'SELECT * FROM users'

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-get-all-users-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
