const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        foods(
          name,
          description,
          type,
          color,
          weight,
          portion,
          mililiter,
          calorie,
          protein,
          lipid,
          carbohydrate,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
      values: [
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
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-create-food-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
