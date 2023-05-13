const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const tacoFoods = require('../../../TACO.json')

module.exports = async () => {
  const client = await connect()
  if (!client) {
    Logger.error({
      type: 'database-error',
      local: 'postgre-connect-init-foods-service'
    })
    return false
  }

  for (let i = 0; i < tacoFoods.length; i++) {
    await createFoodOnLoop({
      name: tacoFoods[i].description,
      description: tacoFoods[i].description,
      type: tacoFoods[i].category,
      weight: 100,
      calorie: tacoFoods[i].energy_kcal,
      protein: tacoFoods[i].protein_g,
      lipid: tacoFoods[i].lipid_g,
      carbohydrate: tacoFoods[i].carbohydrate_g,
      created_at: time.now(),
      updated_at: time.now()
    }, client)
  }

  await disconnect()
  return true
}

const connect = async (body) => {
  const client = await database.connect()

  if (!client) {
    return null
  }

  return client
}

const disconnect = async (client) => {
  client.release()
  await database.close()
}

const createFoodOnLoop = async (body, client) => {
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
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
      values: [
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
        body.created_at,
        body.updated_at
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-create-food-service'
    })
  }
}
