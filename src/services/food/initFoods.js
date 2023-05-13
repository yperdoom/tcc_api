const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const tacoFoods = require('../../../TACO.json')

module.exports = async () => {
  for (let i = 0; i < tacoFoods.length; i++) {
    const payload = {
      name: tacoFoods[i].description,
      description: tacoFoods[i].description,
      type: tacoFoods[i].category,
      weight: 100,
      calorie: tacoFoods[i].energy_kcal,
      protein: tacoFoods[i].protein_g,
      lipid: tacoFoods[i].lipid_g,
      carbohydrate: tacoFoods[i].carbohydrate_g,
      updated_at: time.now(),
      created_at: time.now()
    }

    await connectAndUpdate(payload)
  }
}

const connectAndUpdate = async (payload) => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  try {
    const query = {
      text: `INSERT INTO 
        foods(
          name,
          description,
          type,
          color,
          weight,
          portion,
          mililiter,
          calorie,
          protein,
          lipid,
          carbohydrate,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      values: [
        payload.name,
        payload.description,
        payload.type,
        payload.color,
        payload.weight,
        payload.portion,
        payload.mililiter,
        payload.calorie,
        payload.protein,
        payload.lipid,
        payload.carbohydrate,
        payload.created_at,
        payload.updated_at
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-init-foods-service'
    })
  }
  client.release()
  await database.close()
}
