const database = require('../../../config/database/pgConnection')

module.exports = async (user_id, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE users
        SET name=$2, password=$3, phone=$4, city=$5, state=$6, birthday=$7, updated_at=$8
        WHERE user_id = $1
        RETURNING *`,
      values: [user_id, body.name, body.password, body.phone, body.city, body.state, body.birthday, body.updated_at]
    }

    res = await client.query(query)

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res.rows
}