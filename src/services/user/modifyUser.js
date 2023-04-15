const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (userId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE users
        SET name=$2, phone=$3, city=$4, state=$5, birthday=$6, updated_at=$7
        WHERE user_id = $1
        RETURNING *`,
      values: [
        userId,
        body.name,
        body.phone,
        body.city,
        body.state,
        body.birthday,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows = null
    
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-modify-user-service'
    })
  }

  client.release()
  await database.close()

  return res.rows
}
