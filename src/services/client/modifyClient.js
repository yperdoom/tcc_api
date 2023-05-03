const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (userId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE clients
        SET age=$2, height=$3, weight=$4, fat_percentage=$5, sex=$6, updated_at=$7
        WHERE user_id = $1
        RETURNING *`,
      values: [
        userId,
        body.age,
        body.height,
        body.weight,
        body.fat_percentage,
        body.sex,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-modify-client-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
