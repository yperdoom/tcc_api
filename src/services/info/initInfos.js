const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const infosMock = require('../../../pre_save/infosMock.json')

module.exports = async (body) => {
  const client = await connect()
  if (!client) {
    Logger.error({
      type: 'database-error',
      local: 'postgre-connect-init-foods-service'
    })
    return false
  } else {
    for (let i = 0; i < infosMock.length; i++) {
      await createInfoOnLoop({
        name: infosMock[i].name,
        description: infosMock[i].description,
        created_at: time.now(),
        updated_at: time.now()
      }, client)
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

const createInfoOnLoop = async (body, client) => {
  try {
    const query = {
      text: `INSERT INTO 
        infos(
          name,
          description,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4)`,
      values: [
        body.name,
        body.description,
        body.created_at,
        body.updated_at
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-create-info-service'
    })
  }
}
