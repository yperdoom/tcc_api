const logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO
        prescriptions(
          name,
          recommended_calorie,
          recommended_protein,
          recommended_lipid,
          recommended_carbohydrate,
          meal_amount,
          client_id,
          manager_id,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
      values: [
        body.name,
        body.recommended_calorie,
        body.recommended_protein,
        body.recommended_lipid,
        body.recommended_carbohydrate,
        body.meal_amount,
        body.client_id,
        body.manager_id,
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows[0] = null
    logger.log(error.message, 'error', error)
  }

  client.release()
  await database.close()

  return res.rows[0]
}
