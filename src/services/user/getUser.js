const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (field, value) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `SELECT * FROM users WHERE ${field} = $1`,
      values: [value]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows = []

    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-get-user-service'
    })
  }

  client.release()
  await database.close()

  return res.rows[0] || null
}
