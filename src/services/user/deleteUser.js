const database = require('../../../config/database/pgConnection')

module.exports = async (userId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `DELETE FROM users
        WHERE user_id = $1`,
      values: [userId]
    }

    res = await client.query(query)
  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res
}
