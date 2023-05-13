const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (foodId, body) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `UPDATE foods 
        SET name=$2,
          description=$3,
          type=$4,
          color=$5,
          weight=$6,
          portion=$7,
          mililiter=$8,
          calorie=$9,
          protein=$10,
          lipid=$11,
          carbohydrate=$12,
          updated_at=$13
        WHERE food_id = $1
        RETURNING *`,
      values: [
        foodId,
        body.name,
        body.description,
        body.type,
        body.color,
        body.weight,
        body.portion,
        body.mililiter,
        body.calorie,
        body.protein,
        body.lipid,
        body.carbohydrate,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-modify-meal-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
