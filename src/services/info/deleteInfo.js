const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (infoId) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `DELETE FROM infos
        WHERE info_id = $1
        RETURNING *`,
      values: [infoId]
    }

    res = await client.query(query)
  } catch (error) {
    res.rows = null

    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-delete-info-service'
    })
  }

  client.release()
  await database.close()

  return res.rows
}
