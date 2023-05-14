const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const foodsMock = require('../../../pre_save/foodsMock.json')

module.exports = async () => {
  const client = await connect()
  if (!client) {
    Logger.error({
      type: 'database-error',
      local: 'postgre-connect-init-foods-service'
    })
    return false
  } else {
    for (let i = 0; i < foodsMock.length; i++) {
      const res = await createFoodOnLoop({
        name: foodsMock[i].description,
        description: foodsMock[i].description,
        type: foodsMock[i].category,
        weight: 100,
        calorie: foodsMock[i].energy_kcal.toFixed(2),
        protein: foodsMock[i].protein_g.toFixed(2),
        lipid: foodsMock[i].lipid_g.toFixed(2),
        carbohydrate: foodsMock[i].carbohydrate_g.toFixed(2),
        created_at: time.now(),
        updated_at: time.now()
      }, client)
      if (!res) { break }
    }

    await disconnect()
  }

  return true
}

const connect = async () => {
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

    return true
  } catch (error) {
    console.log(error)
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-create-food-service'
    })
    return false
  }
}
