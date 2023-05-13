const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (mealId, foodId) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `INSERT INTO
        meal_food(
          meal_id
          food_id,
        )
        VALUES($1, $2)
        RETURNING *`,
      values: [
        mealId,
        foodId
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-create-meal-food-sync-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
