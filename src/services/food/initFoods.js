const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTime')
const foodsMock = require('../../../pre_save/foodsMock.json')

module.exports = async () => {
  const client = await _connect()
  if (!client) {
    Logger.error({
      type: 'database-error',
      local: 'postgre-connect-init-foods-service'
    })
    return null
  } else {
    for (let i = 0; i < foodsMock.length; i++) {
      const payload = await {
        name: _refactorName(foodsMock[i].description),
        description: foodsMock[i].description,
        type: foodsMock[i].category,
        weight: 100,
        calorie: _refactorNutrients(foodsMock[i].energy_kcal),
        protein: _refactorNutrients(foodsMock[i].protein_g),
        lipid: _refactorNutrients(foodsMock[i].lipid_g),
        carbohydrate: _refactorNutrients(foodsMock[i].carbohydrate_g),
        created_at: time.now(),
        updated_at: time.now()
      }

      const res = await _createFoodOnLoop(payload, client)
      if (!res) { break }
    }

    await _disconnect(client)
  }
  return true
}

const _refactorNutrients = (nutrient) => {
  if (typeof nutrient === 'number') {
    nutrient = parseFloat(nutrient)
  } else {
    nutrient = 0
  }

  return nutrient.toFixed(2)
}

const _refactorName = (description) => {
  const match = description.match(/,/)

  if (match) {
    return description.substring(0, match.index)
  }
  return description
}

const _connect = async () => {
  const client = await database.connect()

  if (!client) {
    return null
  }

  return client
}

const _disconnect = async (client) => {
  await client.release()
  await database.close()
}

const _createFoodOnLoop = async (body, client) => {
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
    console.log(error)
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-create-food-service'
    })
    return false
  }
  return true
}
