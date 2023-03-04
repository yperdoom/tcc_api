const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (mealId, foodId) => {
  const client = await database.connect()
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
    res.rows[0] = null
    
    Logger.error({
      ...error,
      type:'database-error',
      local: 'postgre-create-meal-food-sync-service'
    })
  }

  client.release()
  await database.close()

  return res.rows[0]
}
