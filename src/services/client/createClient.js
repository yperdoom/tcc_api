const database = require('../../../config/database/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        clients(age, height, weight, fat_percentage, sex, user_id, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
      values: [body.age, body.height, body.weight, body.fat_percentage, body.sex, body.user_id, body.created_at, body.updated_at]
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
