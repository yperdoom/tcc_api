const database = require('../../../config/database/pgConnection')

module.exports = async (email) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `SELECT * FROM users WHERE email = $1`,
      values: [email]
    }

    res = await client.query(query)

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res.rows[0]
}