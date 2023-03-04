const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        meal(
          name,
          type,
          recommended_calorie,
          calorie,
          recommended_protein,
          protein,
          recommended_lipid,
          lipid,
          recommended_carbohydrate,
          carbohydrate,
          food_multiplier,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
      values: [
        body.name,
        body.type,
        body.recommended_calorie,
        body.calorie,
        body.recommended_protein,
        body.protein,
        body.recommended_lipid,
        body.lipid,
        body.recommended_carbohydrate,
        body.carbohydrate,
        body.food_multiplier,
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows[0] = null
    
    Logger.error({
      ...error,
      type:'database-error',
      local: 'postgre-create-meal-service'
    })
  }

  client.release()
  await database.close()

  return res.rows[0]
}
