const logger = require('../../controllers/loggerController')
const database = require('../../../config/database/pgConnection')

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
    logger.log({ type: 'error', message: error.message, body: error })
  }

  client.release()
  await database.close()

  return res.rows
}
