const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const tacoFoods = require('../../../TACO.json')

const testFunction = () => {
  const payload = {
    name: tacoFoods[0].description,
    description: tacoFoods[0].description,
    type: tacoFoods[0].category,
    weight: 100,
    calorie: tacoFoods[0].energy_kcal,
    protein: tacoFoods[0].protein_g,
    lipid: tacoFoods[0].lipid_g,
    carbohydrate: tacoFoods[0].carbohydrate_g,
    updated_at: time.now(),
    created_at: time.now()
  }

  console.log(tacoFoods[0])
  // for (let i = 0; i < 10; i++) {
  //   console.log(i)
  // }
  // await connectAndUpdate(payload)
}

testFunction()

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
