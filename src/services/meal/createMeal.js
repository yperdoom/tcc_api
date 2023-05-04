const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        meals(name, type, recommended_calorie, calorie, recommended_protein, protein, recommended_lipid, lipid, recommended_carbohydrate, carbohydrate, food_amount, is_adapted_meal, foods, foods_multiplier, fitness, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
      values: [
        body.name, // 1
        body.type, // 2
        body.recommended_calorie, // 3
        body.calorie, // 4
        body.recommended_protein, // 5
        body.protein, // 6
        body.recommended_lipid, // 7
        body.lipid, // 8
        body.recommended_carbohydrate, // 9
        body.carbohydrate, // 10
        body.is_adapted_meal, // 11
        body.foods, // 12
        body.foods_multiplier, // 13
        body.fitness, // 14
        body.food_amount, // 15
        body.created_at, // 16
        body.updated_at // 17
      ]
    }

    res = await client.query(query)
  } catch (error) {
    console.log(error)
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-create-meal-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
