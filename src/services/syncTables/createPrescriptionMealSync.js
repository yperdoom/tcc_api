const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (prescriptionId, mealId) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

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
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-create-prescription-meal-sync-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
