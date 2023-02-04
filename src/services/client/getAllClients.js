const logger = require('../../controllers/loggerController')
const database = require('../../../config/database/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  let res = {}

  try {
    const query = 'SELECT * FROM clients'

    res = await client.query(query)
  } catch (error) {
    res.rows = null
    logger.log({ type: 'error', message: error.message, body: error })
  }

  client.release()
  await database.close()

  return res.rows
}
