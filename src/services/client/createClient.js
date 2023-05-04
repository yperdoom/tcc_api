const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        clients(age, height, weight, fat_percentage, sex, manager_id, user_id, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
      values: [
        body.age,
        body.height,
        body.weight,
        body.fat_percentage,
        body.sex,
        body.manager_id,
        body.user_id,
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-create-client-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
