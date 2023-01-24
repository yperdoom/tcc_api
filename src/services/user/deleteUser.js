const database = require('../../../config/database/pgConnection')

module.exports = async (user_id, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `DELETE FROM users
        WHERE user_id = $1`,
      values: [user_id]
    }

    res = await client.query(query)

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  // if (res.rowCount > 0) {
  //   return true
  // }
  return res
}