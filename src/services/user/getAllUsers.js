const database = require('../../../config/database/pgConnection')

module.exports = async () => {
  const client = await database.connect()
  let res = {}

  try {
    const query = 'SELECT * FROM users'

    res = await client.query(query)

  } catch (error) {
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res.rows
}