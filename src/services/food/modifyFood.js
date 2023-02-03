const database = require('../../../config/database/pgConnection')

module.exports = async (foodId, body) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE foods 
        SET name=$2,
          description=$3,
          type=$4,
          color=$5,
          weight=$6,
          portion=$7,
          mililiter=$8,
          calorie=$9,
          protein=$10,
          lipid=$11,
          carbohydrate=$12,
          updated_at=$13
        WHERE food_id = $1
        RETURNING *`,
      values: [
        foodId,
        body.name,
        body.description,
        body.type,
        body.color,
        body.weight,
        body.portion,
        body.mililiter,
        body.calorie,
        body.protein,
        body.lipid,
        body.carbohydrate,
        body.updated_at
      ]
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
