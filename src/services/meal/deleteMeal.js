const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (foodId) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `DELETE FROM foods
        WHERE food_id = $1
        RETURNING *`,
      values: [foodId]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows = null
    
    Logger.error({
      ...error,
      type:'database-error',
      local: 'postgre-delete-meal-service'
    })
  }

  client.release()
  await database.close()

  return res.rows
}
