const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (userId) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `DELETE FROM users
        WHERE user_id = $1
        RETURNING *`,
      values: [userId]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-delete-user-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
