const database = require('../../../config/database/pgConnection')

module.exports = async (body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        users(name, email, password, scope, phone, city, state, birthday, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
      values: [body.name, body.email, body.password, body.scope, body.phone, body.city, body.state, body.birthday, body.created_at, body.updated_at]
    }

    res = await client.query(query)
  } catch (error) {
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res.rows
}
