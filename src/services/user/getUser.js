const database = require('../../../config/database/pgConnection')

module.exports = async (user_id) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `SELECT * FROM users WHERE user_id = $1`,
      values: [user_id]
    }

    res = await client.query(query)

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return row
}