const logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  let res = {}

  try {
    const query = 'SELECT * FROM users'

    res = await client.query(query)
  } catch (error) {
    res.rows = null
    logger.log(error.message, 'error', error)
  }

  client.release()
  await database.close()

  return res.rows
}
