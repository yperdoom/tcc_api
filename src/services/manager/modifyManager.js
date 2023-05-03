const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (userId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE managers
        SET document=$2, updated_at=$3
        WHERE user_id = $1
        RETURNING *`,
      values: [
        userId,
        body.document,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-modify-manager-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
