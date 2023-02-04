const database = require('../../../config/database/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        managers(document, user_id, created_at, updated_at)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
      values: [
        body.document,
        body.user_id,
        body.created_at,
        body.updated_at
      ]
    }

    res = await client.query(query)
  } catch (error) {
    console.log(error.message)
  }

  client.release()

  await database.close()

  if (res.rows) {
    return res.rows[0]
  }
  return null
}
