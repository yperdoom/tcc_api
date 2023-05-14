const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (userId, body) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `UPDATE users
        SET name=$2, phone=$3, document=$4, city=$5, state=$6, birthday=$7, updated_at=$8
        WHERE user_id = $1
        RETURNING *`,
      values: [
        userId,
        body.name,
        body.phone,
        body.document,
        body.city,
        body.state,
        body.birthday,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-modify-user-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
