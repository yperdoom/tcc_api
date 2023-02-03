const database = require('../../../config/database/pgConnection')

module.exports = async (field, value) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `SELECT * FROM foods WHERE ${field} = $1`,
      values: [value]
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
