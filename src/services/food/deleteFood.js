const database = require('../../../config/database/pgConnection')

module.exports = async (foodId) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `DELETE FROM foods
        WHERE food_id = $1`,
      values: [foodId]
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
