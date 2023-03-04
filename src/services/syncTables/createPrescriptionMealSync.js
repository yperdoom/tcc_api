const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (prescriptionId, mealId) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO
        prescription_meal(
          prescription_id,
          meal_id
        )
        VALUES($1, $2)
        RETURNING *`,
      values: [
        prescriptionId,
        mealId
      ]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows[0] = null
    
    Logger.error({
      ...error,
      type:'database-error',
      local: 'postgre-create-prescription-meal-sync-service'
    })
  }

  client.release()
  await database.close()

  return res.rows[0]
}
