const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (field, value) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `SELECT * FROM foods WHERE ${field} = $1`,
      values: [value]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-get-meal-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
