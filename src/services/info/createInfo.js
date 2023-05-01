const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        infos(
          name,
          description,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4)
        RETURNING *`,
      values: [
        body.name,
        body.description,
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-create-info-service'
    })
  }

  client.release()
  await database.close()

  if (res.rowCount >= 1) {
    return res.rows
  }
  return null
}
