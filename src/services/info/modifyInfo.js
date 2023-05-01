const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (infoId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE infos 
        SET name=$2,
          description=$3,
          updated_at=$13
        WHERE info_id = $1
        RETURNING *`,
      values: [
        infoId,
        body.name,
        body.description,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-modify-info-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
